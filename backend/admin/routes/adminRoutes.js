const express = require('express');
const { adminAccess, authenticateToken } = require('../../middlewares/userAuthentication');
const { registerAdmin, loginAdmin } = require('../controllers/admins');
const { adminCreateUser, adminUpdateUser, adminDeleteUser } = require('../controllers/adminCRUD');
const router = express.Router();

router.post('/registerAdmin', registerAdmin);
// router.post('/loginAdmin', loginAdmin);

router.use(authenticateToken, adminAccess);
router.post('/admincreateuser', adminCreateUser);
router.post('/adminupdateuser', adminUpdateUser);
router.delete('/admindeleteuser', adminDeleteUser);

module.exports = router;