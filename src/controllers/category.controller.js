const Products = require("../models/Product");

// API trả JSON (tìm kiếm sản phẩm)
exports.getProducts = async (req, res) => {
    try {
        const { q: keyword = "", category = "", gender = "" } = req.query;
        const query = {};

        if (keyword) query.name = { $regex: keyword, $options: "i" };
        if (category) query.category = { $regex: `^${category}$`, $options: "i" };
        if (gender) query.gender = { $regex: `^${gender}$`, $options: "i" };

        const products = await Products.find(query);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Render trang category / product với filter chung
exports.renderProductsPage = async (req, res) => {
    try {
        const { q: keyword = "", category = "", gender = "" } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = 12;
        const skip = (page - 1) * limit;
        const cart = req.cart || { items: [] }; // Lấy giỏ hàng từ middleware
        const query = {};
        if (keyword) query.name = { $regex: keyword, $options: "i" };
        if (category) query.category = { $regex: `^${category}$`, $options: "i" };
        if (gender) query.gender = { $regex: `^${gender}$`, $options: "i" };

        const totalProducts = await Products.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        const products = await Products.find(query)
            .skip(skip)
            .limit(limit);

        res.render("pages/category", {
            products,
            keyword,
            category,
            gender,
            page,
            totalPages,
            currentPage: page,
            cart
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Chi tiết sản phẩm
exports.getProductDetail = async (req, res) => {
    try {
        const product = await Products.findById(req.params.id);
        if (!product) return res.status(404).send("Không tìm thấy sản phẩm");
        res.render("pages/product", { product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
