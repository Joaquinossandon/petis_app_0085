// variables de entorno
require("dotenv").config();

// Servidor
const express = require("express");
const fileUpload = require("express-fileupload");
const hbs = require("hbs");
const path = require("path");

// encriptar pass
const bcrypt = require("bcrypt");

// Modelos y base de datos
const User = require("./src/models/User.model");
const sequelize = require("./src/config/db.config");
const cookieParse = require("./src/middleware/cookieParse");

const routes = require("./src/routes");

const app = express();


// middlewares
app.use(
    fileUpload({
        createParentPath: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParse);


// hbs config
hbs.registerPartials(__dirname + "/src/views/partials", (err) => {});

hbs.registerHelper("isAuth", () => {
    return app.locals.isAuth;
});
hbs.registerHelper("isAuth", () => {
    return app.locals.isAdmin;
});

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/src/views"));


// usa las rutas creadas
app.use(routes)

// ejecutamos nuestro servidor
const main = async () => {
    try {
        await sequelize.sync({ alter: true });
        const admin = await User.findOne({
            where: {
                email: "admin@petis.cl",
            },
        });
        if (!admin) {
            User.create({
                name: "admin",
                email: "admin@petis.cl",
                password: await bcrypt.hash("admin123", 10),
                role: "admin",
            });
        }

        app.listen(3000, () => {
            console.log("Servidor escuchando en http://localhost:3000/");
        });
    } catch (error) {
        console.log(error);
    }
};

main();
