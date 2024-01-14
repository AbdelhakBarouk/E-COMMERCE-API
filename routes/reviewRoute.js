const express = require("express");
const reviewRouter = express.Router({ mergeParams: true });
const {
  CreateReview,
  updateReview,
  getSingleReview,
  deleteReview,
  getAllReview,
} = require("../controllers/reviewController");

const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

reviewRouter.route("/").get(getAllReview).post(authenticateUser, CreateReview);
reviewRouter
  .route("/:id")
  .get(authenticateUser, getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);

module.exports = reviewRouter;
