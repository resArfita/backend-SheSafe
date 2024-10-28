const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const journalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  file: { type: String, required: true },
  created: { type: Date, required: true },
  deleted: { type: Date, required: true },
  edited: { type: Date, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
});

const Journal = mongoose.model("Journal", journalSchema);

module.exports = Journal;
