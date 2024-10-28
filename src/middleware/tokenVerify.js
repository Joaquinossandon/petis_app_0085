const jwt = require("jsonwebtoken");

const tokenVerify = (token) => {
    const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET, {
        algorithms: ["HS256"],
    });
    return tokenVerify;
};

const verifyAccessView = (req, res, next) => {
    const tokenCookie = req.cookies.token;
    try {
        const token = tokenVerify(tokenCookie);
        req.user = token;
        next();
    } catch (error) {
        res.redirect("/login");
    }
};

const verifyAccessApi = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer qefui2832932

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
