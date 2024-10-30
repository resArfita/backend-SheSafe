const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const casesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  isAnonimous: { type: String, Default: "false" },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  approvedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
  created: { type: Date, Default: Date.now },
  isApproved: { type: String },
  supportCount: { type: String },
  message: { type: String }, // pesan untuk komunitas diisi oleh user bersifat opsional
  notes: { type: String }, //notes ini diisi oelh admin ketika approve dan bersifat opsional
});

const Cases = mongoose.model("Cases", casesSchema);
const findAllCasesWithCategory = async () => {
  try {
    const cases = await Cases.find().populate("category");
    cases.forEach((doc) => {
      console.log("Case Title:", doc.title);
      console.log("Category Name:", doc.category.name);
    });
  } catch (error) {
    console.error("Error fetching cases:", error);
  }
};

findAllCasesWithCategory();
module.exports = Cases;
