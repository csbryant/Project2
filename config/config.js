/* eslint-disable camelcase */
require("dotenv").config();

module.exports = {
<<<<<<< HEAD
  development: {
    username: process.env.DB_username,
    password: process.env.DB_password,
    database: process.env.DB_database,
    host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
=======
  "development": {
    "username": process.env.DB_username="root",
    "password": process.env.DB_password="Indifilm1976",
    "database": process.env.DB_database="cheatsheet_db",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": "Indifilm1976",
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
>>>>>>> d2bc9461e1f53f6a587eec3759ba47b5a3f5d465
  },
  production: {
    use_env_variable: "JAWSDB_URL",
    dialect: "mysql",
  },
};
