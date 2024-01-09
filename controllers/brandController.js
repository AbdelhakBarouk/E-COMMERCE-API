const Brand = require("../models/brandModel");
const slugify = require("slugify");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

// Upload single image
const uploadBrandImage = uploadSingleImage("image", "brand");

const getAllBrands = async (req, res) => {
  const brands = await Brand.find({});
  res.status(StatusCodes.OK).json({ count: brands.length, brands });
};
const getSingleBrand = async (req, res) => {
  const brand = await Brand.findOne({ _id: req.params.id });
  if (!brand) {
    throw new CustomError.NotFoundError(`No brand with id: ${req.params.id}`);
  }
  res.status(StatusCodes.OK).json({ brand });
};
const createBrand = async (req, res) => {
  const { name } = req.body;
  const { file } = req;
  if (!name || !req.file) {
    throw new CustomError.BadRequestError("please provide all needed values");
  }
  const slug = slugify(req.body.name);
  const brandImagePath = "/brand/" + req.file.filename;

  const brand = await Brand.create({
    name,
    slug,
    image: brandImagePath,
  });
  res.status(StatusCodes.OK).json({ brand });
};
const updateBrand = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new CustomError.BadRequestError(`please provide all values`);
  }

  const brand = await Brand.findOne({ _id: req.params.id });
  if (!brand) {
    throw new CustomError.NotFoundError(
      `No brand found with id: ${req.params.id}`
    );
  }

  brand.name = name;
  brand.slug = slugify(name);

  await brand.save();

  res.status(StatusCodes.OK).json({ brand });
};
const deleteBrand = async (req, res) => {
  const brand = await Brand.findOneAndDelete({ _id: req.params.id });
  if (!brand) {
    throw new CustomError.NotFoundError(
      `No brand foudn with id: ${req.params.id}`
    );
  }

  res.status(StatusCodes.OK).json({ msg: "brand deleted!!", brand });
};

module.exports = {
  getAllBrands,
  getSingleBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
};
