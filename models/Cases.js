const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const casesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  isAnonimous: { type: String, Default: "false" },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  approvedBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
  created: { type: Date, Default: Date.now },
  isApproved: { type: String },
  supportCount: { type: String },
  message: { type: String }, // pesan untuk komunitas diisi oleh user bersifat opsional
  notes: { type: String }, //notes ini diisi oelh admin ketika approve dan bersifat opsional
});

const doc = await Parent.findOne().populate("category");
const Cases = mongoose.model("Cases", casesSchema);

module.exports = Cases;
