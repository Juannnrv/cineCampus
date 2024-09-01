const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    movement_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    payment_method: {
      type: String,
      enum: ["credit card", "cash"],
      required: true,
    },
    paid: {
      type: Boolean,
      required: true,
    },
    card_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "card",
      default: null,
      required: false,
    },
  },
  {
    collection: "payment",
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

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
