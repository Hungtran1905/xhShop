const Products = require("../models/Product");

// Lấy tất cả sản phẩm
exports.getHomepage = async (req, res) => {
    try {
        const products = await Products.find();
        res.render("pages/home.ejs", { products: products });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProductPage = (req, res) => {
    res.render("pages/category.ejs", { title: "Sản phẩm" });
};

exports.getShippingPage = (req, res) => {
    res.render("pages/shipping.ejs", { title: "Vận chuyển" });
};

// Thêm sản phẩm mới
exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Lấy sản phẩm theo ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




