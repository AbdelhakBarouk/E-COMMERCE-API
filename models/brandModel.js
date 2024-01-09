const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brand name must be provided "],
      unique: [true, "brand name must be unique"],
      minlength: [3, "too short brand name"],
      maxlength: [32, "too long brand name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Brand", brandSchema);
