const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    host: "localhost",
    port: 5433,
    username: "postgres",
    password: "admin123",
    database: "petis",
    dialect: "postgres",
});

module.exports = sequelize;
