const mongoose = require("mongoose");

const MovementSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    show_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "show",
      required: true,
    },
    date_movement: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["on Hold", "booked", "purchased", "rejected", "cancelled"],
      required: true,
    },
    seats: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    collection: "movement",
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

const Movement = mongoose.model("Movement", MovementSchema);

module.exports = Movement;
