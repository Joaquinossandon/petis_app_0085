const jwt = require("jsonwebtoken");

const tokenVerify = (token) => {
    const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET, {
        algorithms: ["HS256"],
    });
    return tokenVerify;
};

const verifyAccessView = (req, res, next) => {
    const tokenCookie = req.cookies.token;
    const excluded = ["/login", "/register"];
    try {
        const token = tokenVerify(tokenCookie);
        req.user = token;
        req.app.locals.isAuth = true;
        req.app.locals.isAdmin = token.role === "admin";
        if (excluded.includes(req.path)) {
            return res.redirect("/");
        }
        return next();
    } catch (error) {
        req.app.locals.isAuth = false;
        req.app.locals.isAdmin = false;
        if (excluded.includes(req.path)) {
            return next();
        }
        return res.redirect("/login");
    }
};

const verifyAccessApi = (req, res, next) => {
    const token = req.cookies.token; // Bearer token

    try {
        const tokenPayload = tokenVerify(token);
        req.user = tokenPayload;
        next();
    } catch (error) {
        res.status(403).json({
            error: "No tienes permisos",
        });
    }
};

module.exports = { verifyAccessView, verifyAccessApi };
