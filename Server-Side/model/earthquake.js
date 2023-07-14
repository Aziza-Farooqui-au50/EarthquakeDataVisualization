const mongoose = require("mongoose");

const earthquakeSchema = new mongoose.Schema({
  dateTime: Date,
  region: String,
  magnitude: Number,
  latitude: Number,
  longitude: Number,
});
const Earthquake = mongoose.model("Earthquake", earthquakeSchema);
module.exports = Earthquake;
