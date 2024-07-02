const User = require('../models/user');
const Order = require('../models/order');

const userPurchases = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const orders = await Order.find({ customer: user._id, paymentStatus: 'paid' });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "You haven't made any purchases" });
        }

        return res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { userPurchases };
