const SubCategory = require("../models/subCategoryModel");
const Category = require("../models/categoryModel");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const slugify = require("slugify");

const getAllSubCategories = async (req, res) => {
  const category = req.params.categoryId;
  const subCategories = await SubCategory.find({ category });
  res
    .status(StatusCodes.OK)
    .json({ count: subCategories.length, subCategories });
};
const getSingleSubCategory = async (req, res) => {
  const category = req.params.categoryId;
  const id = req.params.id;
  const subCategory = await SubCategory.find({ category, _id: id });
  if (!subCategory) {
    throw new CustomError.NotFound("Sub Category Not Found!");
  }
  res.status(StatusCodes.OK).json(subCategory);
};
const createSubCategory = async (req, res) => {
  const { name } = req.body;
  const category = req.params.categoryId;
  if (!category || !name) {
    throw new CustomError.BadRequestError("please provide all values");
  }
  req.body.slug = slugify(name);
  const categoryExist = await Category.findOne({ _id: category });
  req.body.category = category;
  if (!categoryExist) {
    throw new CustomError.NotFoundError(`No category with id: ${category}`);
  }
  const subCategory = await SubCategory.create(req.body);
  res
    .status(StatusCodes.OK)
    .json({ msg: "sub category created!!", subCategory });
};
const updateSubCategory = async (req, res) => {
  const { name } = req.body;
  const id = req.params.id;
  if (!name) {
    throw new CustomError.BadRequestError("please provide all values");
  }
  const subCategory = await SubCategory.findOne({ _id: id });
  if (!subCategory) {
    throw new CustomError.NotFoundError(`No sub category with id: ${id}`);
  }

  subCategory.name = name;
  subCategory.slug = slugify(name);

  await subCategory.save();
  res.status(StatusCodes.OK).json({ subCategory });
};
const deleteSubCategory = async (req, res) => {
  const subCategory = await SubCategory.findOneAndDelete({
    _id: req.params.id,
  });

  if (!subCategory) {
    throw new CustomError.NotFoundError(
      `No sub category with id : ${req.params.id}`
    );
  }

  res.status(StatusCodes.OK).json(subCategory);
};

module.exports = {
  getAllSubCategories,
  getSingleSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
