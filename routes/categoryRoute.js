const express = require("express");
const categoryRouter = express.Router();

const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

const {
  getAllCategories,
  getSingleCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
} = require("../controllers/CategoryController");

//nested route
const subCategoryRouter = require("./subCategoryRoute");
categoryRouter.use("/:categoryId/subCategories", subCategoryRouter);

categoryRouter
  .route("/")
  .get(getAllCategories)
  .post(
    authenticateUser,
    authorizePermission("admin"),
    uploadCategoryImage,
    createCategory
  );
categoryRouter
  .route("/:id")
  .get(getSingleCategory)
  .patch(authenticateUser, authorizePermission("admin"), updateCategory)
  .delete(authenticateUser, authorizePermission("admin"), deleteCategory);

module.exports = categoryRouter;
