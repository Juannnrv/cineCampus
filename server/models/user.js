const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    role: {
      type: String,
      required: false,
      default: "user",
      enum: ["user", "userVIP", "admin"],
    },
    card_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
      default: null,
      required: false,
    },
    phone: {
      type: String,
    },
  },
  {
    collection: "user",
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

const User = mongoose.model("User", userSchema);

module.exports = User;