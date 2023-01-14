const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    _id: {type: String, required: true},
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "customer" },
    book: {type: Boolean,default: true}
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
