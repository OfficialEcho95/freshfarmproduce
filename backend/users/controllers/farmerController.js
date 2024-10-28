const Commodity = require('../../users/models/commodity');
const User = require('../../users/models/user');
const { initializePayment } = require('../../../payment/paymentController');
const Order = require('../models/order');
const Post = require('../models/post');
const { createObjectCsvWriter } = require('csv-writer');
const paginate = require('express-paginate');
const express = require('express');
const redisClient = require('../../../redisClient');
const router = express.Router();
router.use(paginate.middleware(20, 5000)); // 20 items per page, max limit of 5000
const cron = require('node-cron');



//route for farmer to add product to his catalogue
const addCommodity = async (req, res) => {
    try {
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized - user not logged in" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // to confirm that user is infact eligible to add products
        if (user.role !== 'farmer') {
            return res.status(403).json({ message: "Forbidden - user is not a farmer" });
        }

        const { title, description, price, quantityAvailable, categories, location } = req.body;

        let imageUrls = [];

        if (req.files && req.files.length > 0) {
            imageUrls = req.files.map(file => `commodityUploads/${file.filename}`);
        }

        const newCommodity = new Commodity({
            farmer: userId,
            title,
            description,
            price,
            quantityAvailable,
            images: imageUrls,
            categories,
            location,
        });

        await newCommodity.save();

        // Update the user's commodities array
        user.commodities.push(newCommodity._id);
        await user.save();

        const newPost = new Post({
            commodity: newCommodity._id,
            title: newCommodity.title,
            description: newCommodity.description,
            price: newCommodity.price,
            images: newCommodity.images,
            tags: newCommodity.categories,
            lastDisplayedAt: new Date(0),
        });

        await newPost.save();

        res.status(201).json({ message: "Commodity added and posted successfully", commodity: newCommodity, post: newPost });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error encountered adding commodity" });
    }
};

//route to purchase a commodity
const buyCommodity = async (req, res) => {
    try {
        const { items } = req.body;

        const userId = req.session.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let totalPrice = 0;
        const orderItems = [];

        for (const item of items) {
            const { commodityId, quantityPurchased } = item;

            const commodity = await Commodity.findById(commodityId);

            if (!commodity) {
                return res.status(404).json({ message: `Commodity with ID ${commodityId} not found` });
            }

            if (commodity.quantityAvailable < quantityPurchased) {
                return res.status(400).json({ message: `Not enough quantity available for commodity with ID ${commodityId}` });
            }

            totalPrice += commodity.price * quantityPurchased;

            orderItems.push({
                commodity: commodityId,
                quantity: quantityPurchased,
                price: commodity.price,
                seller: commodity.farmer,
                image: commodity.images[0],
            });
        }

        // Create and save the order
        const order = new Order({
            customer: user._id,
            items: orderItems,
            totalAmount: totalPrice,
            paymentStatus: 'pending',
            deliveryAddress: user.deliveryAddress
        });
        await order.save();

        // Initialize payment
        try {
            const paymentData = await initializePayment(user.email, totalPrice * 100, order._id);
            res.status(200).json({
                message: "Payment initialization successful",
                authorizationUrl: paymentData.authorization_url,
                accessCode: paymentData.access_code,
                orderId: order._id,
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error encountered purchasing commodities" });
    }
};

//route to delete a commodity
const deleteCommodityByName = async (req, res) => {
    try {
        const { name } = req.params;

        // Find the commodity by name and delete it
        const commodity = await Commodity.findOneAndDelete({ title: name });

        if (!commodity) {
            return res.status(404).json({ message: "Commodity not found" });
        }

        res.status(200).json({ message: "Commodity deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error encountered deleting commodity" });
    }
};

// route to update commodity
const updateCommodity = async (req, res) => {
    try {
        const { id, comId } = req.params; //farmer id
        const data = req.body; //comId is commodity Id

        const commodityId = await Commodity.findOne({ _id: comId });

        if (!commodityId) {
            return res.status(402).json({ message: "Not a valid product id" });
        }

        let imageUrls = [];
        if (req.files) {
            imageUrls = req.files.map(file => `commodityUploads/${file.filename}`);
        }

        const updateData = { ...data };
        if (imageUrls.length > 0) {
            updateData.images = imageUrls;
        }

        const commodity = await Commodity.findByIdAndUpdate(comId, updateData, { new: true });

        if (!commodity) {
            return res.status(404).json({ message: "Error updating commodity" });
        }

        return res.status(200).json({ message: "Commodity updated successfully", commodity });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error encountered updating commodity" });
    }
};

//route to find farmer
const getCommoditiesByFarmer = async (req, res) => {
    try {
        const { farmerId } = req.params;
        const commodities = await Commodity.find({ farmer: farmerId });

        if (!commodities.length) {
            return res.status(404).json({ message: "No commodities found for this farmer" });
        }

        return res.status(200).json({ commodities });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error encountered retrieving commodities" });
    }
};

// Get All Commodities
const getAllCommodities = async (req, res) => {
    try {
        const commodities = await Commodity.find();
        res.status(200).json({ commodities });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error encountered retrieving commodities" });
    }
};

// Get Commodity by ID
const getCommodityById = async (req, res) => {
    try {
        const { id } = req.params;
        const commodity = await Commodity.findById(id);

        if (!commodity) {
            return res.status(404).json({ message: "Commodity not found" });
        }

        res.status(200).json({ commodity });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error encountered retrieving commodity" });
    }
};

//route to search commodities
const searchCommodities = async (req, res) => {
    try {
        const query = req.query.q;

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // case-insensitive regular expression to search for commodities
        const commodities = await Commodity.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { categories: { $regex: query, $options: 'i' } },
                { location: { $regex: query, $options: 'i' } }
            ]
        });

        res.status(200).json({ commodities });
    } catch (error) {
        console.error('Error during commodity search:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

//route to get the all complete sales for sellers
const mostCompletedSales = async (req, res) => {
    try {
        // Aggregate query to find top farmers by completedSales
        const topFarmers = await User.aggregate([
            {
                $match: {
                    role: 'farmer',
                    completedSales: { $gt: 0 }
                }
            },
            {
                $group: {
                    _id: '$role',
                    farmers: {
                        $push: {
                            _id: '$_id',
                            name: '$name',
                            completedSales: '$completedSales'
                        }
                    }
                }
            },
            {
                $unwind: '$farmers' //Deconstructs the farmers array for further processing
            },
            {
                $sort: { 'farmers.completedSales': -1 } // Sort descending by completedSales
            },
            {
                $limit: 20 // Limit to the top 20 farmers
            }
        ]);

        res.json(topFarmers);
    } catch (error) {
        console.error('Error fetching top farmers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// route to get the most sold prodcts by vendors
const mostSoldProduct = async (req, res) => {
    try {
        const { farmerId } = req.params;
        if (!farmerId) {
            return res.status(404).json({ message: "Farmer not found" });
        }

        const allOrders = await Order.find({ "items.farmer": farmerId, "paymentStatus": "paid" });

        if (!allOrders.length) {
            return res.status(404).json({ message: "No completed sales found" });
        }

        const productSales = {};

        // Tally the quantities sold for each product
        allOrders.forEach(order => {
            order.items.forEach(item => {
                if (item.farmer.toString() === farmerId) {
                    if (!productSales[item.commodity]) {
                        productSales[item.commodity] = item.quantity;
                    } else {
                        productSales[item.commodity] += item.quantity;
                    }
                }
            });
        });

        // Find the product(s) with the highest sales
        let mostSoldProducts = [];
        let maxSales = 0;

        for (const [productId, sales] of Object.entries(productSales)) {
            if (sales > maxSales) {
                maxSales = sales;
                mostSoldProducts = [productId];
            } else if (sales === maxSales) {
                mostSoldProducts.push(productId);
            }
        }

        if (mostSoldProducts.length === 0) {
            return res.status(404).json({ message: "No sales data available" });
        }

        // populate product details, i might delete later
        const mostSoldProductDetails = await Commodity.find({ _id: { $in: mostSoldProducts } });

        res.status(200).json({ mostSoldProducts: mostSoldProductDetails, maxSales });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching most sold products" });
    }
};


//all complete orders by a seller
const getCompleteOrdersByFarmer = async (req, res) => {
    try {
        const { farmerId } = req.params;
        const farmer = await User.findById(farmerId);
        if (!farmer) {
            return res.status(404).json({ message: 'Farmer not found' });
        }

        // Find orders where the payment status is 'paid' and the commodity belongs to the farmer
        const orders = await Order.find({
            paymentStatus: 'paid'
        }).populate('items.commodity').populate('customer');

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Route to get the sales reports
const salesReport = async (req, res) => {
    try {
        const { format } = req.query;
        const { page, limit } = req.query;
        const skip = (page - 1) * limit;

        const orders = await Order.find({ paymentStatus: 'paid' })
            .populate('items.commodity')
            .populate('items.farmer')
            .skip(skip)
            .limit(limit);

        const data = orders.map(order => {
            return order.items.map(item => ({
                itemName: item.commodity.name,
                sellerName: item.farmer.name,
                quantity: item.quantity,
                amountPaid: item.price * item.quantity,
                orderId: order._id,
                orderDate: order.createdAt,
            }));
        }).flat();

        if (format === 'csv') {
            // Export to CSV
            const csvWriter = createObjectCsvWriter({
                path: 'sales_report.csv',
                header: [
                    { id: 'itemName', title: 'Item Name' },
                    { id: 'sellerName', title: 'Seller Name' },
                    { id: 'quantity', title: 'Quantity Bought' },
                    { id: 'amountPaid', title: 'Amount Paid' },
                    { id: 'orderId', title: 'Order ID' },
                    { id: 'orderDate', title: 'Order Date' }
                ]
            });

            await csvWriter.writeRecords(data);
            res.download('sales_report.csv');
        } else if (format === 'chart') {
            // View as pie chart
            const itemSales = data.reduce((acc, item) => {
                if (!acc[item.itemName]) {
                    acc[item.itemName] = 0;
                }
                acc[item.itemName] += item.quantity;
                return acc;
            }, {});

            const chartData = {
                labels: Object.keys(itemSales),
                datasets: [{
                    data: Object.values(itemSales),
                    backgroundColor: Object.keys(itemSales).map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`)
                }]
            };

            res.json({ chartData });
        } else {
            // Display on screen with pagination
            const itemCount = await Order.countDocuments({ paymentStatus: 'paid' });
            const pageCount = Math.ceil(itemCount / limit);

            res.json({
                has_more: paginate.hasNextPages(req)(pageCount),
                items: data,
                pageCount,
                itemCount
            });
        }
    } catch (error) {
        console.error('Error generating sales report:', error);
        res.status(500).json({ message: 'Error generating sales report' });
    }
};

// route to get the user reports and behaviors, might be implemented later


// route to get the invertory reports, might also be implemented later

// products/commodities tracker
const productsTracker = async (req, res) => {
    try {
        const lowCommodities = [];
        const commodities = await Commodity.find().populate('farmer');

        if (!commodities || commodities.length === 0) {
            return res.status(404).json({ message: "No resources found" });
        }

        // Identify commodities running low
        commodities.forEach(commodity => {
            if (commodity.quantityAvailable <= 40) {
                lowCommodities.push({
                    title: commodity.title,
                    quantityAvailable: commodity.quantityAvailable,
                    email: commodity.farmer.email,
                });
            }
        });

        // Publish events to Redis for each low commodity
        const publishPromises = lowCommodities.map((comm) =>
            redisClient.publish('running low on product', JSON.stringify({
                email: comm.email,
                subject: `Running low on product: ${comm.title}`,
                text: `The product "${comm.title}" is running low with only ${comm.quantityAvailable} items left.`,
            }))
        );

        await Promise.all(publishPromises);

        return res.status(200).json({
            message: "Checked all products and published notifications for low commodities.",
            lowCommodities,
        });
    } catch (error) {
        console.error('Error tracking products:', error);
        res.status(500).json({ message: "An error occurred while tracking products." });
    }
};

// Scheduling the function to run every 24 hours
cron.schedule('0 0 * * *', () => {
    console.log("Running productsTracker job...");
    productsTracker();
});

module.exports = {
    router, salesReport,
    addCommodity, buyCommodity, getCommoditiesByFarmer,
    getCommodityById, getAllCommodities, updateCommodity,
    updateCommodity, deleteCommodityByName, searchCommodities,
    getCompleteOrdersByFarmer, mostCompletedSales, mostSoldProduct
};
