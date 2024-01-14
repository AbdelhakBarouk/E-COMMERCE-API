const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, "review rating is required"],
      min: [1, "the min rating is 1.0"],
      max: [5, "the max rating is 5.0"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "review title is required"],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, "review comment is required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "please provide the user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "please provide the product"],
    },
  },
  { timestamps: true }
);

reviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    {
      $match: {
        product: productId,
      },
    },
    {
      $group: {
        _id: null,
        ratingAverage: {
          $avg: "$rating",
        },
        ratingQuantity: {
          $sum: 1,
        },
      },
    },
  ]);
  console.log(result);
  try {
    await this.model("Product").findOneAndUpdate(
      { _id: productId },
      {
        ratingAverage: Math.ceil(result[0]?.ratingAverage || 0),
        ratingQuantity: result[0]?.ratingQuantity || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.product);
});
reviewSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await this.constructor.calculateAverageRating(this.product);
  }
);
module.exports = mongoose.model("Review", reviewSchema);
