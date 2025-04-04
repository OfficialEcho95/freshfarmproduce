const https = require('https');
const Order = require('../backend/users/models/order');
const Commodity = require('../backend/users/models/commodity');
const User = require('../backend/users/models/user');
const redisClient = require('../redisClient');

// route to initialize payment
const initializePayment = async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId).populate('customer', 'email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const { email } = order.customer;
    const amount = order.totalAmount * 100; // Convert to kobo for Paystack

    const params = JSON.stringify({
      email,
      amount,
      metadata: { orderId },
    });

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: '/transaction/initialize',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SECRET_KEY_AUTHORIZATION}`,
        'Content-Type': 'application/json',
      },
    };

    const paystackReq = https.request(options, (paystackRes) => {
      let data = '';

      paystackRes.on('data', (chunk) => {
        data += chunk;
      });

      paystackRes.on('end', () => {
        const response = JSON.parse(data);
        if (response.status) {
          res.status(200).json({
            authorization_url: response.data.authorization_url,
            access_code: response.data.access_code,
            message: 'Payment initialized successfully',
          });
        } else {
          console.log(response.data);
          res.status(400).json({ message: response.message });
        }
      });
    });

    paystackReq.on('error', (error) => {
      console.error('Paystack request error:', error);
      res.status(500).json({ message: 'Error initializing payment' });
    });

    paystackReq.write(params);
    paystackReq.end();
  } catch (error) {
    console.error('Error initializing payment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// This route will verify and update the quantity of that commodity left
const verifyPayment = async (req, res) => {
  const { reference } = req.params;

  if (!reference) {
    return res.status(400).json({ message: 'Payment reference is required' });
  }

  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: `/transaction/verify/${reference}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.SECRET_KEY_AUTHORIZATION}`,
    },
  };

  const paystackReq = https.request(options, (paystackRes) => {
    let data = '';

    paystackRes.on('data', (chunk) => {
      data += chunk;
    });

    paystackRes.on('end', async () => {
      try {
        const response = JSON.parse(data);

        const { orderId } = response.data.metadata;
        if (response.status && response.data.status === 'success') {
          const order = await Order.findById(orderId).populate('customer', 'email');
          if (!order) {
            return res.status(404).json({ message: 'Order not found' });
          }

          order.paymentStatus = 'paid';
          order.paymentDetails = {
            reference: response.data.reference,
            transferCode: response.data.transfer_code,
            status: response.data.status,
            transferredAt: response.data.transferred_at,
          };
          await order.save();

          /**
                     * adding a redis event tracker to add this to the job queue and send the user the notification
                     * Publish an event to the Redis channel
                    * */
          await redisClient.publish('order-confirmation', JSON.stringify({
            email: order.customer.email,
            subject: `Your Order ${order._id.toString()}`,
            text: `Your Order has been shipped!\n The following order will arrive in ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
          }));

          // Update inventory and completed sales for sellers
          const sellerIds = new Set();

          try {
            const updateCommodityPromises = order.items.map(async (item) => {
              const commodity = await Commodity.findById(item.commodity);
              if (!commodity) {
                throw new Error(`Commodity not found for ID: ${item.commodity}`);
              }
              commodity.quantityAvailable -= item.quantity;
              return commodity.save();
            });

            await Promise.all(updateCommodityPromises);

            // Collect seller IDs after commodities have been updated
            order.items.forEach((item) => sellerIds.add(item.farmer));

            const updateSellerPromises = Array.from(sellerIds).map(async (sellerId) => {
              const seller = await User.findById(sellerId);
              if (!seller) {
                throw new Error(`Seller not found for ID: ${sellerId}`);
              }
              seller.completedSales += 1;
              await seller.save();
            });

            await Promise.all(updateSellerPromises);
          } catch (error) {
            console.error('Error updating commodities or sellers:', error);
          }
          return res.status(200).json({ message: 'Payment verified and order updated', order });
        }
        console.log(response.data);
        return res.status(400).json({ message: 'Payment verification failed', data: response.data });
      } catch (error) {
        // console.error('Error parsing JSON response:', error);
        res.status(500).json({ message: 'Error parsing response from Paystack' });
      }
    });
  }).on('error', (error) => {
    console.error('Error making request to Paystack:', error);
    res.status(500).json({ message: 'Error encountered during payment verification' });
  });

  paystackReq.end();
};

module.exports = { initializePayment, verifyPayment };
