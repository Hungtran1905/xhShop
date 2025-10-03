const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

router.get('/', cartController.getCart);
router.post("/add", cartController.addToCart);
router.post("/remove", cartController.removeFromCart);
router.get("/cartPage", cartController.getCartPage);
router.post("/remove-multiple", cartController.removeMultiple);
router.post("/checkout", cartController.checkout);
module.exports = router;
