const Review = require("../models/reviewModel");
const Product = require("../models/productModel");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermission } = require("../utils");

// @desc Create a product's review
// @route CREATE /reviews
// @access public (for authenitcated user)
const CreateReview = async (req, res) => {
  const { title, comment, product, rating } = req.body;
  if (!title || !comment || !rating || !product) {
    throw new CustomError.BadRequestError("please provide all values");
  }
  req.body.user = req.user.userId;
  //check the product
  const productExist = await Product.findOne({ _id: product });
  if (!productExist) {
    throw new CustomError.NotFoundError(`No product with id: ${product}`);
  }
  //check if the user already submit a review for this product
  const reviewAlreadySubmitted = await Review.findOne({
    product,
    user: req.user.userId,
  });
  if (reviewAlreadySubmitted) {
    throw new CustomError.BadRequestError(
      "you already submit a review for this product"
    );
  }
  const review = await Review.create(req.body);

  res.status(StatusCodes.CREATED).json(review);
};

// @desc Get all reviews
// @route GET /reviews
// @access public (for authenitcated user)
const getAllReview = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "title price",
  });

  res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
};

// @desc Get single review
// @route GET /reviews/:id
// @access public (for authenitcated user)
const getSingleReview = async (req, res) => {
  const reviewId = req.params.id;
  const review = await Review.findOne({ _id: reviewId }).populate({
    path: "product",
    select: "title price",
  });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id: ${reviewId}`);
  }
  res.status(StatusCodes.OK).json(review);
};

// @desc Update a review
// @route PATCH /reviews/:id
// @access public (for authenitcated user)
const updateReview = async (req, res) => {
  const reviewId = req.params.id;
  const { title, rating, comment } = req.body;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id: ${reviewId}`);
  }
  // Check the user is owner of this review
  checkPermission(review.user, req.user);

  review.title = title;
  review.comment = comment;
  review.rating = rating;

  review.save();

  res.status(StatusCodes.OK).json({ review });
};

// @desc Delete a review
// @route DELETE /reviews/:id
// @access public (for authenitcated user)
const deleteReview = async (req, res) => {
  const reviewId = req.params.id;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id: ${reviewId}`);
  }
  // Check the user is owner of this review
  checkPermission(review.user, req.user);
  await review.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Review deleted", review });
};

module.exports = {
  getAllReview,
  CreateReview,
  updateReview,
  getSingleReview,
  deleteReview,
};
