/* eslint-disable jest/require-hook */
const express = require('express');
const uploadImages = require('../../../multerUploads');

const router = express.Router();
const { authenticateToken, authorizeFarmerOrAdmin } = require('../../middlewares/userAuthentication');

const {
  getCommoditiesByFarmer, addCommodity, buyCommodity,
  deleteCommodityByName, updateCommodity,
  getCompleteOrdersByFarmer, searchCommodities,
  getCommodityById, salesReport, mostCompletedSales,
  mostSoldProduct,
} = require('../controllers/farmerController');

const {
  registerUser, updateUserData, loginUser, loginAdmin, logoutUser, checkSession,
} = require('../controllers/userController');
const { verifyPayment, initializePayment } = require('../../../payment/paymentController');
const { userPurchases, mostPurchasedProduct, topPurchasedProducts } = require('../controllers/buyerController');
const { getPosts } = require('../controllers/homefeedController');
const {
  addItemToCart, getCart, updateCartItem, removeCartItem, clearCart, checkout, checkoutCart,
} = require('../controllers/cartController');

router.post('/register-user', registerUser);
router.post('/login-user', loginUser);

// protected routes 
router.use(authenticateToken);
router.post('/check-session', checkSession);
router.get('/logout-user', logoutUser);
router.put('/update-user-data', updateUserData);
router.get('/farmer/:farmerId/commodities', getCommoditiesByFarmer);
router.get('/most-completed-sales/:userId', mostCompletedSales);
router.get('/most-sold-product-by-vendor/:farmerId', mostSoldProduct);
router.post('/add-commodity', uploadImages, addCommodity);
router.post('/buy-commodity', buyCommodity);
router.delete('/delete-commodity/:name', deleteCommodityByName);
// router.put('/update-commodity/:id/:comId', authorizeFarmerOrAdmin, updateCommodity);
router.get('/search', searchCommodities);
router.get('/most-purchased-product-by-buyer/:userId', mostPurchasedProduct);
router.get('/top-purchased-products/:userId', topPurchasedProducts);
router.get('/commodity-by-id/:id', getCommodityById);
router.get('/user-purchases/:id', userPurchases);
router.get('/get-farmer-complete-orders/:farmerId', getCompleteOrdersByFarmer);
// router.get('/get-farmer-complete-orders/:farmerId',
// authorizeFarmerOrAdmin, getCompleteOrdersByFarmer);
router.get('/posts', getPosts);
router.get('/sales-report', salesReport);
router.post('/add-to-cart', addItemToCart);
router.get('/cart', getCart);
router.put('/update-cart/:itemId', updateCartItem);
router.delete('/remove-item-cart/:itemId', removeCartItem);
router.delete('/clear-cart', clearCart);
router.get('/checkout', checkoutCart);

// payments routes
router.post('/initialize-payment', initializePayment);
router.get('/verify-payment/:reference', verifyPayment);

module.exports = router;
