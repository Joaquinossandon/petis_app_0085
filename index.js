// variables de entorno
require("dotenv").config();

// Servidor
const express = require("express");
const fileUpload = require("express-fileupload");
const hbs = require("hbs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Modelos y base de datos
const User = require("./src/models/User.model");
const Pet = require("./src/models/Pet.model");
const sequelize = require("./src/config/db.config");
const cookieParse = require("./src/middleware/cookieParse");
const { verifyAccessView, verifyAccessApi } = require("./src/middleware/tokenVerify");

const app = express();

app.use(
    fileUpload({
        createParentPath: true,
    })
);

app.use(express.json());

app.use(express.static(path.join(__dirname, "/public")));

hbs.registerPartials(__dirname + "/src/views/partials", (err) => {});

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/src/views"));

app.get("/", async (req, res) => {
    const mascotas = await Pet.findAll();
    res.render("index", {
        layout: "layouts/main",
        pets: mascotas,
    });
});

app.get("/login", (req, res) => {
    res.render("login", {
        layout: "layouts/main",
    });
});

app.get("/register", cookieParse, verifyAccessView, (req, res) => {
    if (req.user) {
        res.redirect("/agregar");
    } else {
        res.render("register", {
            layout: "layouts/main",
        });
    }
});

app.get("/agregar", cookieParse, verifyAccessView, async (req, res) => {
    try {
        const users = await User.findAll();

        res.render("agregar", {
            layout: "layouts/main",
            users,
        });
    } catch (error) {
        res.redirect("/login");
    }
});

app.post("/api/signup", async (req, res) => {
    const { name, email, password } = req.body;

    const cryptedPass = await bcrypt.hash(password, 10);

    const user = await User.create(
        {
            name,
            email,
            password: cryptedPass,
        },
        {
            returning: true,
        }
    );

    res.status(200).json(user);
});

app.post("/api/signin", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        where: { email },
    });

    const isValid = await bcrypt.compare(password, user?.password || "default");

    if (!user || !isValid) {
        return res.status(400).json({
            error: "Los datos son incorrectos",
        });
    }

    const token = jwt.sign({ user_id: user.id }, process.env.TOKEN_SECRET, {
        expiresIn: "30m",
    });

    res.status(200).json({ token });
});

app.post("/api/user/pet", verifyAccessApi, async (req, res) => {
    const { user_id } = req.user;
    const { name, specie, breed, age } = req.body;
    const { files } = req;

    files.photo.mv(`./public/img/${files.photo.name}`, (err) => {
        if (err) {
            console.log(err);
            throw new Error("No se pudo subir la imagen");
        }
    });

    const user = await User.findByPk(user_id);

    const pet = await user.createPet({
        name,
        specie,
        breed,
        age: Number(age),
        photo: `/img/${files.photo.name}`,
    });

    res.status(200).json(pet);
});

const main = async () => {
    try {
        await sequelize.sync({ alter: true });
        app.listen(3000, () => {
            console.log("Servidor escuchando en http://localhost:3000/");
        });
    } catch (error) {
        console.log(error);
    }
};

main();
