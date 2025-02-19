const mongoose = require("mongoose");

class Database {
  constructor() {
    this._connect();
  }


  _connect() {
    mongoose
      .connect(
        `${process.env.MONGO_PROTOCOLO}${process.env.MONGO_USER}:${process.env.MONGO_PSW}@${process.env.MONGO_HOST}/${process.env.MONGO_DB_NAME}`
      )
      .then(() => {
        console.log("Database connection successful");
      })
      .catch((err) => {
        console.error({
          message: "Database connection error",
          error: err.message,
        });
      });
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Database();
    }
    return this.instance;
  }
}

module.exports = Database;
