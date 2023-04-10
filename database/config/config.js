require("dotenv").config();
const {
  DATABASE_DIALECT,
  DATABASE_PASSWORD,
  DATABASE_USERNAME,
  DATABASE_NAME,
} = process.env;

module.exports = {
  development: {
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    host: "127.0.0.1",
    dialect: DATABASE_DIALECT,
  },
};
