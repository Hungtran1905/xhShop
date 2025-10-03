const Cart = require("../models/Cart");

exports.getCart = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'Chưa login' });
    }
    try {
        const cart = await Cart.findOne({ userId: req.session.userId });
        res.json({ success: true, cart: cart || { items: [] } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


// Thêm sản phẩm vào giỏ
exports.addToCart = async (req, res) => {
    try {
        const { productId, name, size, price, images, quantity } = req.body;

        const qty = Number(quantity) || 1;
        console.log("check req ", req.body);
        let cart = await Cart.findOne({ userId: req.session.userId });
        if (!cart) {
            cart = new Cart({ userId: req.session.userId, items: [] });
        }

        const idx = cart.items.findIndex(
            item => item.productId.toString() === productId && item.size === size
        );

        if (idx > -1) {
            cart.items[idx].quantity += qty;
        } else {
            cart.items.push({
                productId: productId,
                name,
                size,
                price,
                quantity: qty,
                images: images || []

            });
        }

        await cart.save();
        res.json({ success: true, cart });

    } catch (err) {
        console.error("❌ Lỗi server addToCart:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// Xóa sản phẩm khỏi giỏ
exports.removeFromCart = async (req, res) => {
    try {
        const { productId, size } = req.body;


        // Tìm giỏ hàng
        let cart = await Cart.findOne({ userId: req.session.userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: "まだログインしていません！" });
        }

        // Lọc bỏ sản phẩm theo productId + size
        cart.items = cart.items.filter(
            item => !(item.productId.toString() === productId && item.size === size)
        );

        await cart.save();
        return res.json({ success: true, cart });

    } catch (err) {
        console.error("❌ Lỗi removeFromCart:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// Hiển thị trang giỏ hàng
exports.getCartPage = async (req, res) => {
    try {
        if (!req.session.userId) {
            // Nếu chưa login thì redirect
            return res.redirect('/auth/login');
        }

        // Lấy giỏ hàng của user
        let cart = await Cart.findOne({ userId: req.session.userId });

        if (!cart) {
            cart = { items: [], total: 0 };
        } else {
            // Tính tổng tiền
            const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            cart = { items: cart.items, total };
        }

        res.render('pages/cartPage', {
            userId: req.session.userId,
            userName: req.session.userName,
            userImg: req.session.userImg,
            cart,
            images: cart.items.flatMap(item => item.images || []),

        });

    } catch (err) {
        console.error(err);
        res.status(500).send('サーバーエラーが発生しました');
    }
};

// Xoá nhiều sản phẩm khỏi giỏ hàng
exports.removeMultiple = async (req, res) => {
    try {
        const { items } = req.body; // [{ productId, size }, ...]
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Chưa login" });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.json({ success: false, message: "Cart not found" });

        // lọc ra những item KHÔNG nằm trong danh sách xoá
        cart.items = cart.items.filter(
            item => !items.some(rm => rm.productId == item.productId && rm.size == item.size)
        );

        // tính lại tổng tiền
        cart.total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

        await cart.save();
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// Checkout (tạo đơn hàng mới)
const Order = require("../models/Order");
exports.checkout = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) return res.status(401).json({ success: false, message: "まだログインしていない！" });

        const { shippingInfo, items } = req.body;
        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "チェックアウトする商品はまだ選択されていません。" });
        }

        // Tính tổng tiền
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Lưu đơn hàng
        const order = new Order({
            userId,
            items,
            shippingInfo,
            total
        });
        await order.save();

        // Cập nhật giỏ hàng: xoá các sản phẩm đã đặt, giữ lại phần còn lại
        const cart = await Cart.findOne({ userId });
        if (cart) {
            cart.items = cart.items.filter(
                cartItem => !items.some(checked =>
                    checked.productId == cartItem.productId && checked.size == cartItem.size
                )
            );
            await cart.save();
        }

        res.json({ success: true, message: "Đặt hàng thành công", orderId: order._id });
    } catch (err) {
        console.error("❌ Checkout error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
