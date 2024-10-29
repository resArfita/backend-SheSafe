const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  fileIdentity: { type: String, required: true },
  isValidated: { type: String, default: "false" },
  validated: { type: Date, default: "" },
  validatedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
  created: { type: Date, required: true, default: Date.now },
  edited: { type: Date, default: "" },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
