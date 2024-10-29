const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const User = sequelize.define("user", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM, // ["user", "admin"] cómo los asigno?
        values: ["user", "admin"],
        defaultValue: "user",
    },
});

module.exports = User;
