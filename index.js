// Servidor
const express = require("express");
const fileUpload = require("express-fileupload");
const hbs = require("hbs");
const path = require("path");

// Modelos y base de datos
const User = require("./src/models/User.model");
const Pet = require("./src/models/Pet.model");
const sequelize = require("./src/config/db.config");

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

app.post("/api/user", async (req, res) => {
    const { name, email } = req.body;

    const user = await User.create(
        {
            name,
            email,
        },
        {
            returning: true,
        }
    );

    res.status(200).json(user);
});

app.post("/api/user/:idUser/pet", async (req, res) => {
    const { idUser } = req.params;
    const { name, specie, breed, age } = req.body;
    const { files } = req;

    files.photo.mv(`./public/img/${files.photo.name}`, (err) => {
        if (err) {
            console.log(err);
            throw new Error("No se pudo subir la imagen");
        }
    });

    const user = await User.findByPk(idUser);

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
        await sequelize.sync();
        app.listen(3000, () => {
            console.log("Servidor escuchando en http://localhost:3000/");
        });
    } catch (error) {
        console.log(error);
    }
};

main();
