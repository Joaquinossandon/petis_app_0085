const User = require("../models/User.model");

const addToUser = async (req, res) => {
    const { user_id, role } = req.user;
    const { name, specie, breed, age, idUser } = req.body;
    const { files } = req;

    files.photo.mv(`./public/img/${files.photo.name}`, (err) => {
        if (err) {
            console.log(err);
            throw new Error("No se pudo subir la imagen");
        }
    });

    const user = await User.findByPk(role === "admin" ? idUser : user_id);

    const pet = await user.createPet({
        name,
        specie,
        breed,
        age: Number(age),
        photo: `/img/${files.photo.name}`,
    });

    res.status(200).json(pet);
};

module.exports = { addToUser };
