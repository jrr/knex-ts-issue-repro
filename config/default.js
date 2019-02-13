require("dotenv").config({
  silent: false
});

module.exports = {
  environment: process.env.NODE_ENV,
  databaseUrl: process.env.DATABASE_URL,
};