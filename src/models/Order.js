const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            name: String,
            size: String,
            price: Number,
            quantity: Number,
            images: [String]
        }
    ],
    shippingInfo: {
        name: String,
        email: String,
        phone: String,
        address: String,
        note: String
    },
    total: { type: Number, required: true },
    status: { type: String, default: "Pending" }, // Pending, Paid, Shipped
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
