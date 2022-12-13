const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const orderSchema = new Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.String,
      ref: "User",
      required: true,
    },
    items: { type: Object, required: true },
    status: { type: String, default: "order_placed" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);