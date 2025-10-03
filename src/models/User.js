const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Khai báo schema
const UserSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: [true, "ユーザー名は必須です"],
        minlength: [3, "ユーザー名は3文字以上で入力してください"],
        maxlength: [50, "ユーザー名は50文字以内で入力してください"]
    },
    user_email: {
        type: String,
        required: [true, "メールアドレスは必須です"],
        unique: true,
        minlength: [5, "メールアドレスが短すぎます"],
        maxlength: [100, "メールアドレスは100文字以内で入力してください"],
        match: [/^\S+@\S+\.\S+$/, "有効なメールアドレスを入力してください"]
    },
    user_password: {
        type: String,
        required: [true, "パスワードは必須です"],
        minlength: [6, "パスワードは6文字以上で入力してください"],
        maxlength: [128, "パスワードは128文字以内で入力してください"]
    },
    user_img: {
        type: String,
        default: "default.webp",
        maxlength: [200, "画像のURLは200文字以内で入力してください"]
    },
    user_sex: {
        type: String,
        enum: {
            values: ["male", "female", "other"],
            message: "性別は male, female, other のいずれかを選択してください"
        },
        default: "other"
    },
    user_role: {
        type: String,
        enum: {
            values: ["customer", "admin"],
            message: "役割は customer または admin を選択してください"
        },
        default: "customer"
    },
    create_at: {
        type: Date,
        default: Date.now
    },
    update_at: {
        type: Date,
        default: Date.now
    }
});

// 🔒 Mã hóa mật khẩu trước khi lưu
UserSchema.pre("save", async function (next) {
    if (!this.isModified("user_password")) return next();
    this.user_password = await bcrypt.hash(this.user_password, 10);
    next();
});

// ✅ Hàm so sánh mật khẩu
UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.user_password);
};

module.exports = mongoose.model("User", UserSchema);
