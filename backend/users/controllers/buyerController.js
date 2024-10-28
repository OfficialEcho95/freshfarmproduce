const User = require('../models/user');
const Order = require('../models/order');
const Commodity = require('../models/commodity')

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


//function to get the most product purchased by a customer
const mostPurchasedProduct = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not valid" });
        }

        const orders = await Order.find({ customer: user._id, paymentStatus: 'paid' });

        if (!orders.length) {
            return res.status(404).json({ message: "No purchases found for this user" });
        }

        const productPurchases = {};

        // Tally the quantities purchased for each product
        orders.forEach(order => {
            order.items.forEach(item => {
                if (!productPurchases[item.commodity]) {
                    productPurchases[item.commodity] = item.quantity;
                } else {
                    productPurchases[item.commodity] += item.quantity;
                }
            });
        });

        // Determine the most purchased product(s)
        let mostPurchasedProducts = [];
        let maxQuantity = 0;

        for (const [productId, quantity] of Object.entries(productPurchases)) {
            if (quantity > maxQuantity) {
                maxQuantity = quantity;
                mostPurchasedProducts = [productId];
            } else if (quantity === maxQuantity) {
                mostPurchasedProducts.push(productId);
            }
        }

        if (mostPurchasedProducts.length === 0) {
            return res.status(404).json({ message: "No purchased products found" });
        }

        const mostPurchasedProductDetails = await Commodity.find({ _id: { $in: mostPurchasedProducts } });

        res.status(200).json({ mostPurchasedProducts: mostPurchasedProductDetails, maxQuantity });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error });
    }
};


// function that sorts array of (key/values) to return a number of items
const topNProducts = function (productPurchases, n) {

    // Convert the object into an array of [productId, quantity] pairs
    const productArray = Object.entries(productPurchases);

    // Sort the array based on the quantity, in descending order
    productArray.sort((a, b) => b[1] - a[1]);

    const topProducts = productArray.slice(0, n);

    return topProducts;
};

// function that returns the top 5 highest purchased products
const topPurchasedProducts = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not valid" });
        }

        const orders = await Order.find({ customer: user._id, paymentStatus: 'paid' });

        if (!orders.length) {
            return res.status(404).json({ message: "No purchases found for this user" });
        }

        const productPurchases = {};

        // Tally the quantities purchased for each product'
        orders.forEach(order => {
            order.items.forEach(item => {
                if (!productPurchases[item.commodity]) {
                    productPurchases[item.commodity] = item.quantity; //sets the quantity purchased to the product id 
                } else {
                    productPurchases[item.commodity] += item.quantity;
                }
            });
        });

        // Get the top 5 purchased products
        const top5Products = topNProducts(productPurchases, 5);

        // Optionally, populate product details if needed
        const top5ProductIds = top5Products.map(([productId]) => productId);
        const top5ProductDetails = await Commodity.find({ _id: { $in: top5ProductIds } });

        // Include the purchase quantities in the response
        const result = top5ProductDetails.map(product => ({
            product,
            quantityPurchased: productPurchases[product._id],
        }));

        res.status(200).json({ topPurchasedProducts: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error });
    }
};


module.exports = { userPurchases, mostPurchasedProduct, topPurchasedProducts };
