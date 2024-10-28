const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentarSchema = new mongoose.Schema({
  created: { type: Date, required: true },
  description: { type: String, required: true },
  userID: { type: Schema.Types.ObjectId, ref: "User" },
  CasesID: { type: Schema.Types.ObjectId, ref: "Cases" },
});

const Commentar = mongoose.model("Commentar", commentarSchema);

module.exports = Commentar;
