const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth/auth.controller");
const { isGuest } = require("../middlewares/auth.middleware");


// Trang đăng nhập/register chỉ cho guest
router.get("/login", isGuest, authController.getLoginPage);
router.get("/register", isGuest, authController.getRegisterPage);

// Xử lý đăng nhập/register
router.post("/login", authController.postLogin);
router.post("/register", authController.postRegister);

router.post("/logout", authController.logout);

module.exports = router;
