const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home.controller");
const categoryController = require("../controllers/category.controller");
const authController = require("../controllers/auth/auth.controller");

router.get("/", homeController.getHomepage);
router.get("/shipping", homeController.getShippingPage);

// Route chung cho products với filter
router.get("/product", categoryController.renderProductsPage);
router.get("/productDetail/:id", categoryController.getProductDetail);
// API trả JSON nếu cần
router.get("/getProduct", categoryController.getProducts);

router.get("/login", authController.getLoginPage);
router.get("/register", authController.getRegisterPage);
module.exports = router;
