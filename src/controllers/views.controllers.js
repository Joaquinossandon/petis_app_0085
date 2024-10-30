const { Sequelize } = require("sequelize");
const Pet = require("../models/Pet.model");
const User = require("../models/User.model");

const home = async (req, res) => {
    const mascotas = await Pet.findAll();
    res.render("index", {
        layout: "layouts/main",
        pets: mascotas,
    });
};

const login = (req, res) => {
    res.render("login", {
        layout: "layouts/main",
    });
};

const register = (req, res) => {
    if (req.user) {
        res.redirect("/agregar");
    } else {
        res.render("register", {
            layout: "layouts/main",
        });
    }
};

const addPet = async (req, res) => {
    try {
        if (req.user.role === "admin") {
            return res.redirect("/admin/users");
        }

        return res.render("agregar", {
            layout: "layouts/main",
        });
    } catch (error) {
        res.redirect("/login");
    }
};

const adminUsers = async (req, res) => {
    const { order, field } = req.query;

    const users = await User.findAll({
        attributes: {
            include: [
                [Sequelize.fn("COUNT", Sequelize.col("pets.id")), "petCount"],
            ],
        },
        include: [{ model: Pet, attributes: [] }],
        group: ["user.id"],
        order: [[field || "petCount", order || "ASC"]],
    });

    res.render("admin/users", {
        layout: "layouts/main",
        users,
    });
};

const editUser = async (req, res) => {
    const { idUser } = req.params;
    const user = await User.findByPk(idUser);

    res.render("admin/editUser", {
        layout: "layouts/main",
        user,
    });
};

const adminAddPet = async (req, res) => {
    const { idUser } = req.params;

    res.render("admin/addPet", {
        layout: "layouts/main",
        idUser,
    });
};
module.exports = {
    home,
    login,
    register,
    addPet,
    adminUsers,
    editUser,
    adminAddPet,
};
