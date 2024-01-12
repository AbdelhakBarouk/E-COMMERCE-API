const express = require("express");
const productRouter = express.Router();

const {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadproductCoverImage,
  uploadProductMixOfImages,
} = require("../controllers/productController");

const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

productRouter
  .route("/")
  .get(getAllProducts)
  .post(
    authenticateUser,
    authorizePermission("admin"),
    uploadProductMixOfImages,
    createProduct
  );
productRouter
  .route("/:id")
  .get(getSingleProduct)
  .patch(authenticateUser, authorizePermission("admin"), updateProduct)
  .delete(authenticateUser, authorizePermission("admin"), deleteProduct);

module.exports = productRouter;
