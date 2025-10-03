const e = require('express');
const User = require('../../models/User');
const bcrypt = require('bcrypt');


exports.getLoginPage = async (req, res) => {
    res.render("auth/login");
}

exports.getRegisterPage = async (req, res) => {
    res.render("auth/register");
}

// Xử lý login với session
exports.postLogin = async (req, res) => {
    try {
        const { email, password, currentUrl } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "メールアドレスとパスワードを入力してください" });
        }

        // Tìm user theo email
        const user = await User.findOne({ user_email: email });
        if (!user) {
            return res.status(400).json({ message: "メールアドレスが存在しません" });
        }

        // So sánh password bằng method của model
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "パスワードが正しくありません" });
        }

        // Tạo session
        req.session.userId = user._id;
        req.session.userName = user.user_name;
        req.session.userImg = user.user_img;

        req.session.save(err => {
            if (err) return res.status(500).json({ message: "セッションエラーが発生しました" });

            res.json({ message: "ログイン成功", redirectTo: currentUrl || "/" });
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました", error: err.message });
    }
};


exports.postRegister = async (req, res) => {
    try {
        const { fullName, email, password, currentUrl } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "すべてのフィールドを入力してください" });
        }

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ user_email: email });
        if (existingUser) {
            return res.status(400).json({ message: "メールアドレスは既に存在します" });
        }

        // Tạo user mới
        const user = new User({ user_name: fullName, user_email: email, user_password: password });
        await user.save();
        console.log("User created:", user);
        res.json({ message: "登録成功", redirectTo: currentUrl || "/" });
    } catch (err) {
        res.status(500).json({ message: "サーバーエラーが発生しました: ", error: err.message });
    }
};

// Xử lý logout
exports.logout = (req, res) => {
    try {
        const currentUrl = req.body.currentUrl || "/"; // URL client gửi lên
        console.log("Logout, redirect to:", currentUrl);

        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ message: "セッションエラーが発生しました" });
            }

            // Trả về JSON cho client để redirect
            res.status(200).json({ message: "ログアウト成功しました", redirectTo: currentUrl });
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました", error: err.message });
    }
};


