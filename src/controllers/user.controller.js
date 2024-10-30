const User = require("../models/User.model");

const edit = async (req, res) => {
    const { name, email } = req.body;
    const { idUser } = req.params;

    const user = await User.findByPk(idUser);

    user.update({ name, email });

    res.redirect("/admin/users");
};

module.exports = { edit };
