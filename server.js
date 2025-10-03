const connectDB = require("./src/config/db");
const express = require("express");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const attachUser = require("./src/middlewares/session").attachUser;



require("dotenv").config(); // Chỉ cần 1 lần ở đây

// Kết nối DB
connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware session
app.use(session({
    secret: "your-secret-key", // thay bằng key riêng của bạn
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 ngày
}));

// Cấu hình EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));
app.use(express.static(path.join(__dirname, "src", "public")));

// Middleware đọc dữ liệu form
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(attachUser);

// Static files (CSS, JS, ảnh)

// Routes
const indexRoutes = require("./src/routes/index.routes");
const authRoutes = require("./src/routes/auth.routes");
const cartRoutes = require("./src/routes/cart.routes");
const userRoutes = require("./src/routes/user.routes");
app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);
app.use("/", cartRoutes);
app.use("/user", userRoutes);
// Run server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
