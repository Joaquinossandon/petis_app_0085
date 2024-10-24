const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const User = require("./User.model");

const Pet = sequelize.define("pet", {
    name: {
        type: DataTypes.STRING,
    },
    specie: {
        type: DataTypes.STRING,
    },
    breed: {
        type: DataTypes.STRING,
    },
    age: {
        type: DataTypes.INTEGER,
    },
    photo: {
        type: DataTypes.STRING,
    },
});

Pet.belongsTo(User);
User.hasMany(Pet);

module.exports = Pet;
