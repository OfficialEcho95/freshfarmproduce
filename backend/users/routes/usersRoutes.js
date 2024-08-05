const express = require('express');
const path = require('path');
const uploadImages = require('../../../multerUploads');
const router = express.Router();
const { authenticateToken, authorizeFarmerOrAdmin } = require('../../middlewares/userAuthentication');
const { getCommoditiesByFarmer, addCommodity, buyCommodity, verifyPaymentHandler, deleteCommodityByName, updateCommodity, getCompleteOrdersByFarmer, searchCommodities, getCommodityById, salesReport } = require('../controllers/farmerController');
const { registerUser, updateUserData, loginUser, loginAdmin, logoutUser } = require('../controllers/userController');
const { verifyPayment } = require('../../../payment/paymentController');
const { userPurchases } = require('../controllers/buyerController');
const { getPosts } = require('../controllers/homefeedController');
const { addItemToCart, getCart, updateCartItem, removeCartItem, clearCart } = require('../controllers/cartController');


router.post('/register-user', registerUser);
router.post('/login-user', loginUser);

//protected routes
router.use(authenticateToken);
router.get('/logout-user', logoutUser);
router.put('/update-user-data', updateUserData);
router.get('/farmer/:farmerId/commodities', getCommoditiesByFarmer);
router.post('/add-commodity', uploadImages, addCommodity);
router.post('/buy-commodity', buyCommodity);
router.delete('/delete-commodity/:name', deleteCommodityByName);
router.put('/update-commodity/:id/:comId', authorizeFarmerOrAdmin, updateCommodity);
router.get('/search', searchCommodities);
router.get('/commodity-by-id/:id', getCommodityById);
router.get('/user-purchases/:id', authorizeFarmerOrAdmin, userPurchases);
router.get('/get-farmer-complete-orders/:farmerId', authorizeFarmerOrAdmin, getCompleteOrdersByFarmer)
router.get('/posts', getPosts);
router.get('/sales-report', salesReport);
router.post('/add-to-cart', addItemToCart);
router.get('/cart', getCart);
router.put('/update-cart/:itemId', updateCartItem);
router.delete('/remove-item-cart/:itemId', removeCartItem);
router.delete('/clear-cart', clearCart);

//payments routes
router.get('/verify-payment/:reference', verifyPayment);

module.exports = router;