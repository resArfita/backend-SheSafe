const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  file: { type: String, required: true },
  isValidated: { type: String },
  validated: { type: Date, required: true },
  validatedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
  created: { type: Date, required: true },
  deleted: { type: Date, required: true },
  edited: { type: Date, required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
