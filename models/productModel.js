const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "product tile must be provided"],
      trim: true,
      minlength: [3, "too short product title"],
      maxlength: [100, "too long product title"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "product description must be provided"],
      maxlength: [2000, "too long product description"],
    },
    quantity: {
      type: Number,
      required: [true, "product quantity must be provided"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "product price must be provided"],
      trim: true,
      max: [200000, "too long product price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "product image cover is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      required: [true, "product must be belong to a main category"],
      ref: "Category",
    },
    subcategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingAverage: {
      type: Number,
      min: [1, "product rating must be greater or equal 1.0"],
      max: [5, "product rating must be less than or equal 5.0"],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await this.model("Review").deleteMany({ product: this._id });
  }
);

module.exports = mongoose.model("Product", productSchema);
