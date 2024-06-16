import {Sequelize} from "sequelize";

const db = new Sequelize('db_bengkel', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db;