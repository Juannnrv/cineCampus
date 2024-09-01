const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    validity: {
      type: Boolean,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
  },
  {
    collection: "card",
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

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;
