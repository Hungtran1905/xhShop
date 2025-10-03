// middlewares/session.js
function attachUser(req, res, next) {
    if (req.session && req.session.userId) {
        // Gán userId và userName vào locals để template dùng
        res.locals.userId = req.session.userId;
        res.locals.userName = req.session.userName;
        res.locals.userImg = req.session.userImg;
    } else {
        res.locals.userId = null;
        res.locals.userName = null;
        res.locals.userImg = null;
    }
    next();
}

module.exports = {
    attachUser
};
