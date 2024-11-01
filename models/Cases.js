const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const casesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  isAnonimous: { type: String },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  approvedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
  created: { type: Date },
  approved: { type: Date },
  isApproved: { type: String },
  supportCounter: { type: Number },
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
