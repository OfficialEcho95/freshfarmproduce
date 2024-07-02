const https = require('https');
const Order = require('../backend/users/models/order');
const Commodity = require('../backend/users/models/commodity'); 


//route to initialize payment
const initializePayment = (email, amount, orderId) => {
    return new Promise((resolve, reject) => {
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

        const paystackReq = https.request(options, paystackRes => {
            let data = '';

            paystackRes.on('data', chunk => {
                data += chunk;
            });

            paystackRes.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    console.log('Paystack Response:', response);
                    if (response.status) {
                        resolve({
                            authorization_url: response.data.authorization_url,
                            access_code: response.data.access_code,
                        });
                    } else {
                        reject(new Error(`Payment initialization failed: ${response.message}`));
                    }
                } catch (error) {
                    reject(new Error('Failed to parse response from Paystack'));
                }
            });
        }).on('error', error => {
            reject(error);
        });

        paystackReq.write(params);
        paystackReq.end();
    });
    //At this point we call the payment verfication in
    //payment controller to verify payment
};


// This route will verify and update the quantity of that commodity left
const verifyPayment = async (req, res) => {
    const { reference } = req.params;

    if (!reference) {
        return res.status(400).json({ message: "Payment reference is required" });
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

    const paystackReq = https.request(options, paystackRes => {
        let data = '';

        paystackRes.on('data', chunk => {
            data += chunk;
        });

        paystackRes.on('end', async () => {
            try {
                const response = JSON.parse(data);

                if (response.status && response.data.status === 'success') {
                    const orderId = response.data.metadata.orderId;

                    const order = await Order.findById(orderId);

                    if (!order) {
                        return res.status(404).json({ message: "Order not found" });
                    }

                    order.paymentStatus = 'paid';
                    order.paymentDetails = {
                        reference: response.data.reference,
                        transferCode: response.data.transfer_code,
                        status: response.data.status,
                        transferredAt: response.data.transferred_at,
                    };
                    await order.save();

                    // Update inventory
                    for (let item of order.items) {
                        const commodity = await Commodity.findById(item.commodity);
                        if (commodity) {
                            commodity.quantityAvailable -= item.quantity;
                            await commodity.save();
                        }
                    }

                    res.status(200).json({ message: "Payment verified and order updated", order });
                } else {
                    res.status(400).json({ message: "Payment verification failed", data: response.data });
                }
            } catch (error) {
                console.error('Error parsing JSON response:', error);
                res.status(500).json({ message: "Error parsing response from Paystack" });
            }
        });
    }).on('error', error => {
        console.error('Error making request to Paystack:', error);
        res.status(500).json({ message: "Error encountered during payment verification" });
    });

    paystackReq.end();
};

module.exports = { initializePayment, verifyPayment };
