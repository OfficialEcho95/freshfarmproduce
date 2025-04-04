const Order = require('../../users/models/order');

// Endpoint to get all complete orders
const getAllCompleteOrders = async (req, res) => {
  try {
    const orders = await Order.find({ paymentStatus: 'paid' })
      .populate('items.commodity')
      .populate('items.seller')
      .populate('customer');

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllCompleteOrders };
