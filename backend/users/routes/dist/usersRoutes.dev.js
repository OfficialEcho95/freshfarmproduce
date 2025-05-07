"use strict";

/* eslint-disable jest/require-hook */
var express = require('express');

var uploadImages = require('../../../multerUploads');

var router = express.Router();

var _require = require('../../middlewares/userAuthentication'),
    authenticateToken = _require.authenticateToken,
    authorizeFarmerOrAdmin = _require.authorizeFarmerOrAdmin;

var _require2 = require('../controllers/farmerController'),
    getCommoditiesByFarmer = _require2.getCommoditiesByFarmer,
    addCommodity = _require2.addCommodity,
    buyCommodity = _require2.buyCommodity,
    deleteCommodityByName = _require2.deleteCommodityByName,
    updateCommodity = _require2.updateCommodity,
    getCompleteOrdersByFarmer = _require2.getCompleteOrdersByFarmer,
    searchCommodities = _require2.searchCommodities,
    getCommodityById = _require2.getCommodityById,
    salesReport = _require2.salesReport,
    mostCompletedSales = _require2.mostCompletedSales,
    mostSoldProduct = _require2.mostSoldProduct;

var _require3 = require('../controllers/userController'),
    registerUser = _require3.registerUser,
    updateUserData = _require3.updateUserData,
    loginUser = _require3.loginUser,
    loginAdmin = _require3.loginAdmin,
    logoutUser = _require3.logoutUser,
    checkSession = _require3.checkSession;

var _require4 = require('../../../payment/paymentController'),
    verifyPayment = _require4.verifyPayment,
    initializePayment = _require4.initializePayment;

var _require5 = require('../controllers/buyerController'),
    userPurchases = _require5.userPurchases,
    mostPurchasedProduct = _require5.mostPurchasedProduct,
    topPurchasedProducts = _require5.topPurchasedProducts;

var _require6 = require('../controllers/homefeedController'),
    getPosts = _require6.getPosts;

var _require7 = require('../controllers/cartController'),
    addItemToCart = _require7.addItemToCart,
    getCart = _require7.getCart,
    updateCartItem = _require7.updateCartItem,
    removeCartItem = _require7.removeCartItem,
    clearCart = _require7.clearCart,
    checkout = _require7.checkout,
    checkoutCart = _require7.checkoutCart;

router.post('/register-user', registerUser);
router.post('/login-user', loginUser); // protected routes 

router.use(authenticateToken);
router.post('/check-session', checkSession);
router.get('/logout-user', logoutUser);
router.put('/update-user-data', updateUserData);
router.get('/farmer/:farmerId/commodities', getCommoditiesByFarmer);
router.get('/most-completed-sales/:userId', mostCompletedSales);
router.get('/most-sold-product-by-vendor/:farmerId', mostSoldProduct);
router.post('/add-commodity', uploadImages, addCommodity);
router.post('/buy-commodity', buyCommodity);
router["delete"]('/delete-commodity/:name', deleteCommodityByName); // router.put('/update-commodity/:id/:comId', authorizeFarmerOrAdmin, updateCommodity);

router.get('/search', searchCommodities);
router.get('/most-purchased-product-by-buyer/:userId', mostPurchasedProduct);
router.get('/top-purchased-products/:userId', topPurchasedProducts);
router.get('/commodity-by-id/:id', getCommodityById);
router.get('/user-purchases/:id', userPurchases);
router.get('/get-farmer-complete-orders/:farmerId', getCompleteOrdersByFarmer); // router.get('/get-farmer-complete-orders/:farmerId',
// authorizeFarmerOrAdmin, getCompleteOrdersByFarmer);

router.get('/posts', getPosts);
router.get('/sales-report', salesReport);
router.post('/add-to-cart', addItemToCart);
router.get('/cart', getCart);
router.put('/update-cart/:itemId', updateCartItem);
router["delete"]('/remove-item-cart/:itemId', removeCartItem);
router["delete"]('/clear-cart', clearCart);
router.get('/checkout', checkoutCart); // payments routes

router.post('/initialize-payment', initializePayment);
router.get('/verify-payment/:reference', verifyPayment);
module.exports = router;