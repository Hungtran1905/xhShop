// Kiểm tra user đã login chưa
function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        // Nếu đã login, tiếp tục
        next();
    } else {
        // Nếu chưa login, redirect về login hoặc trả JSON
        res.redirect("/login");
    }
}

// Kiểm tra user chưa login (ví dụ tránh vào login/register khi đã login)
function isGuest(req, res, next) {
    if (!req.session || !req.session.userId) {
        next();
    } else {
        res.redirect("/"); // Nếu đã login, về trang chủ
    }
}

module.exports = { isAuthenticated, isGuest };
