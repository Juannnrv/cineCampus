const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    genre: [
      {
        type: String,
        required: true,
      },
    ],
    duration: {
      type: Number,
      required: true,
    },
    sinopsis: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    cast: [
      {
        name: {
          type: String,
          required: true,
        },
      },
    ],
    poster: {
      type: String,
      required: true,
    },
    trailer: {
      type: String,
      required: true,
    },
  },
  {
    collection: "movie",
    toJSON: {
      transform: (doc, ret, options) => {
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret, options) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
