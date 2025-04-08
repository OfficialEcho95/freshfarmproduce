const express = require('express');
const { adminAccess, adminAuthenticateToken } = require('../../middlewares/userAuthentication');
const { registerAdmin, loginAdmin, logoutAdmin } = require('../controllers/admins');
const {
  adminCreateUser, adminUpdateUser, adminDeleteUser, adminViewUserDetails,
} = require('../controllers/adminCRUD');
const { getAllCompleteOrders } = require('../controllers/sales');
const { salesReport } = require('../controllers/salesReport');

const router = express.Router();

router.post('/registerAdmin', registerAdmin);
// router.post('/loginAdmin', loginAdmin);

router.use(adminAuthenticateToken, adminAccess);
router.get('/logout-admin', logoutAdmin);
router.post('/admincreateuser', adminCreateUser);
router.post('/adminupdateuser', adminUpdateUser);
router.get('/get-user-details/:email', adminViewUserDetails);
router.delete('/admindeleteuser', adminDeleteUser);
router.get('/reports/complete-orders', getAllCompleteOrders);
router.get('/reports/sales', salesReport);

module.exports = router;
