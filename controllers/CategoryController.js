const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const Category = require("../models/categoryModel");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const slugify = require("slugify");
const fs = require("fs/promises");

// Upload single image
const uploadCategoryImage = uploadSingleImage("image", "category");

const getAllCategories = async (req, res) => {
  const categories = await Category.find({});
  res.status(StatusCodes.OK).json({ count: categories.length, categories });
};
const getSingleCategory = async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id });
  if (!category) {
    throw new CustomError.NotFoundError(
      `no category found with the provided id ${req.params.id}`
    );
  }
  res.status(StatusCodes.OK).json({ category });
};
const createCategory = async (req, res) => {
  const { name } = req.body;
  const { file } = req;
  if (!name || !req.file) {
    throw new CustomError.BadRequestError("please provide all needed values");
  }
  const slug = slugify(req.body.name);
  const categoryImagePath = "/category/" + req.file.filename;

  const category = await Category.create({
    name,
    slug,
    image: categoryImagePath,
  });
  res.status(StatusCodes.OK).json({ category });
  //.json({ category, filePath: file.path, fileName: file });
};
const updateCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new CustomError.BadRequestError("please provide all needed values");
  }
  const category = await Category.findOne({ _id: req.params.id });
  if (!category) {
    throw new CustomError.NotFoundError(`no category with id ${req.params.id}`);
  }

  category.name = name;
  category.slug = slugify(name);

  await category.save();

  res.status(StatusCodes.OK).json({ category });
};
const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    throw new CustomError.NotFoundError(
      `no category found with id ${req.params.id}`
    );
  }
  const categoryImagePath = category.image;
  await fs.unlink(`uploads${categoryImagePath}`);
  res.status(StatusCodes.OK).json({ category });
};

module.exports = {
  getAllCategories,
  getSingleCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
};
