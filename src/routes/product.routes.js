const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

// Chi tiết sản phẩm
router.get("/product", productController.getProductDetail);

module.exports = router;
