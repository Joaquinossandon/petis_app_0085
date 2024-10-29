const cookieParse = (req, res, next) => {
    const cookiesString = req.headers.cookie;
    const cookies = cookiesString?.split("; ");
    const cookiesArr = cookies?.map((cookie) => cookie.split("="));
    const cookiesObj = Object.fromEntries(cookiesArr || []);
    req.cookies = cookiesObj;
    next();
};

module.exports = cookieParse;
