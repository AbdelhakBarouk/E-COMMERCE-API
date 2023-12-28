const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 30,
    },
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
