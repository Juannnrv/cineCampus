const mongoose = require("mongoose");

const theaterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    collection: "theater",
    toJSON: {
      transform: (ret) => {
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Theater = mongoose.model("Theater", theaterSchema);

module.exports = Theater;
