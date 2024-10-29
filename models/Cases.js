const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const casesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  isAnonimous: { type: String },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  approvedBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
  isApproved: { type: String, required: true },
  supportCount: { type: String, required: true },
  message: { type: String, required: true }, // pesan untuk komunitas diisi oleh user bersifat opsional
  notes: { type: String }, //notes ini diisi oelh admin ketika approve dan bersifat opsional
});

const Cases = mongoose.model("Cases", casesSchema);

module.exports = Cases;
