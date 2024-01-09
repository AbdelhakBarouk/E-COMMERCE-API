const express = require("express");
const subCategoryRouter = express.Router({ mergeParams: true });

const {
  getAllSubCategories,
  getSingleSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../controllers/subCategoryController");

const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

subCategoryRouter
  .route("/")
  .get(getAllSubCategories)
  .post(authenticateUser, authorizePermission("admin"), createSubCategory);
subCategoryRouter
  .route("/:id")
  .get(getSingleSubCategory)
  .patch(authenticateUser, authorizePermission("admin"), updateSubCategory)
  .delete(authenticateUser, authorizePermission("admin"), deleteSubCategory);

module.exports = subCategoryRouter;
