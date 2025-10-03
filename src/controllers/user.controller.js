const User = require('../models/User');
const Order = require('../models/Order');

exports.getProfilePage = async (req, res) => {
    if (!req.session.userId) return res.redirect('/auth/login');

    try {
        const user = await User.findById(req.session.userId);
        const orders = await Order.find({ userId: req.session.userId }).sort({ createdAt: -1 });

        res.render('pages/userProfile', { user, orders });
    } catch (err) {
        console.error(err);
        res.status(500).send('サーバーエラーが発生しました');
    }
};

exports.updateProfile = async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ success: false });

    try {
        const { fullName, email, phone } = req.body;
        await User.findByIdAndUpdate(req.session.userId, { fullName, email, phone });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};
