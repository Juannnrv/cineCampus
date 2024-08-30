const mongoose = require("mongoose");

const showSchema = new mongoose.Schema(
  {
    movie_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "movement",
      required: true,
    },
    theater_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "theater",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    available_seats: [
      {
        seat: {
          type: String,
          required: true,
        },
        availability: {
          type: Boolean,
          required: true,
        },
        seat_type: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    collection: "show",
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

const Show = mongoose.model("Show", showSchema);

module.exports = Show;
