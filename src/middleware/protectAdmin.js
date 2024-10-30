const protectAdmin = (req, res, next) => {
    const isAdminPath = req.path.includes("/admin");
    const isAdmin = req.user.role === "admin";
    console.log(isAdmin, isAdminPath);
    if (isAdminPath && !isAdmin) {
        return res.redirect("/");
    }

    next();
};

module.exports = protectAdmin;
