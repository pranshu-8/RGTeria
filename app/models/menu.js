// db table
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const menuSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  availibility: { type: Boolean, default: true },
  count : {type: Number, default: 0 }
});

module.exports = mongoose.model("Menu", menuSchema,"menu");
