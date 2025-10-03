const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
        name: String,
        price: Number,
        description: String,
        images: [String],
        category: String,
        brand: String,
        gender: String,
        sizes: [String]
});

module.exports = mongoose.model("products", productSchema);
