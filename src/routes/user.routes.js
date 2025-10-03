const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/', userController.getProfilePage); // trang profile
router.post('/update', userController.updateProfile); // cập nhật thông tin

module.exports = router;
