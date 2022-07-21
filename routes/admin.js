const express = require('express');

const admincontroller = require('../controller/admin_controller');
const authenticateToken = require('../middleware/authmiddle');

const router = express.Router();

router.post('/register', admincontroller.Register);
router.post('/login', admincontroller.Login);
router.post('/logout', authenticateToken, admincontroller.Logout);


module.exports = router;