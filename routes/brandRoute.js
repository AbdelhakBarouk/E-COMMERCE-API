const express = require("express");
const brandRouter = express.Router();

const {
  getAllBrands,
  getSingleBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
} = require("../controllers/brandController");

brandRouter.route("/").get(getAllBrands).post(uploadBrandImage, createBrand);
brandRouter
  .route("/:id")
  .get(getSingleBrand)
  .patch(updateBrand)
  .delete(deleteBrand);

module.exports = brandRouter;
