const mysql = require("mysql2");

const dbConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "swgo",
    port: 3306
});

module.exports = dbConnection;