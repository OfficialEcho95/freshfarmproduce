"use strict";

var express = require('express');

var _require = require('../../middlewares/userAuthentication'),
    adminAccess = _require.adminAccess,
    adminAuthenticateToken = _require.adminAuthenticateToken;

var _require2 = require('../controllers/admins'),
    registerAdmin = _require2.registerAdmin,
    loginAdmin = _require2.loginAdmin,
    logoutAdmin = _require2.logoutAdmin;

var _require3 = require('../controllers/adminCRUD'),
    adminCreateUser = _require3.adminCreateUser,
    adminUpdateUser = _require3.adminUpdateUser,
    adminDeleteUser = _require3.adminDeleteUser,
    adminViewUserDetails = _require3.adminViewUserDetails;

var _require4 = require('../controllers/sales'),
    getAllCompleteOrders = _require4.getAllCompleteOrders;

var _require5 = require('../controllers/salesReport'),
    salesReport = _require5.salesReport;

var router = express.Router();
router.post('/registerAdmin', registerAdmin); // router.post('/loginAdmin', loginAdmin);

router.use(adminAuthenticateToken, adminAccess);
router.get('/logout-admin', logoutAdmin);
router.post('/admincreateuser', adminCreateUser);
router.post('/adminupdateuser', adminUpdateUser);
router.get('/get-user-details/:email', adminViewUserDetails);
router["delete"]('/admindeleteuser', adminDeleteUser);
router.get('/reports/complete-orders', getAllCompleteOrders);
router.get('/reports/sales', salesReport);
module.exports = router;