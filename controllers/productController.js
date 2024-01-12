const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Product = require("../models/productModel");
const Brand = require("../models/brandModel");
const Category = require("../models/categoryModel");
const SubCategory = require("../models/subCategoryModel");
const slugify = require("slugify");
const {
  uploadSingleImage,
  uploadMixOfImages,
} = require("../middlewares/uploadImageMiddleware");

// Upload product cover image
const uploadproductCoverImage = uploadSingleImage("imageCover", "product");
const uploadProductMixOfImages = uploadMixOfImages("product").fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

// @desc Get list of products
// @route GET /api/v1/products
// @access public
const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ count: products.length, products });
};

// @desc Get a specific product by id
// @route GET /api/v1/products/:id
// @access public
const getSingleProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });
  if (!product) {
    throw new CustomError.NotFoundError(`No product zith id: ${rea.params.id}`);
  }
  res.status(StatusCodes.OK).json(product);
};

// @desc Create a product
// @route POST /api/v1/products
// @access private
const createProduct = async (req, res) => {
  const { title, description, quantity, price, category, subcategory, brand } =
    req.body;
  //console.log(req.files);
  if (
    !req.files["imageCover"] ||
    !title ||
    !description ||
    !quantity ||
    !price ||
    !category ||
    !subcategory ||
    !brand
  ) {
    throw new CustomError.BadRequestError("please provide all values");
  }
  const slug = slugify(title);
  const productCoverImagePath =
    "/product/" + req.files["imageCover"][0].filename;

  const images = [];
  if (req.files["images"]) {
    req.files["images"].forEach((file) => {
      images.push("/product/" + file.filename);
    });
  }

  //console.log(images);

  // check brand existance
  const brandExist = await Brand.findOne({ _id: brand });
  if (!brandExist) {
    throw new CustomError.NotFoundError(`No brand with id: ${brand}`);
  }

  //check category existance
  const categoryExist = await Category.findOne({ _id: category });
  if (!categoryExist) {
    throw new CustomError.NotFoundError(`No category with id: ${category}`);
  }

  //check subcategory array
  const subcategoriesOfCategory = await SubCategory.find({ category }).select(
    "_id"
  );

  const subCategoriesIdsInDB = [];
  subcategoriesOfCategory.forEach((subCategory) => {
    subCategoriesIdsInDB.push(subCategory._id.toString());
  });
  //console.log(subCategoriesIdsInDB);
  const checker = (target, arr) => target.every((v) => arr.includes(v));

  //console.log(subcategory);
  if (!checker(subcategory, subCategoriesIdsInDB)) {
    throw new CustomError.BadRequestError(`subcategory not belong to category`);
  }
  const product = await Product.create({
    title,
    description,
    quantity,
    price,
    category,
    subcategory,
    brand,
    slug,
    imageCover: productCoverImagePath,
    images,
  });

  res.status(StatusCodes.OK).json({ product });
};

// @desc Update a product
// @route PATCH /api/v1/products/:id
// @access private
const updateProduct = async (req, res) => {
  if (req.body.title) req.body.slug = slugify(req.body.title);
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${req.params.id}`);
  }

  res.status(StatusCodes.OK).json({ mesg: "product updated!!", product });
};

// @desc Delete a product
// @route DELETE /api/v1/products/:id
// @access private
const deleteProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });
  if (!product) {
    throw new CustomError.NotFoundError(`No product zith id: ${req.params.id}`);
  }
  await product.deleteOne();

  res
    .status(StatusCodes.OK)
    .json({ msg: "product successfully deleted", product });
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadproductCoverImage,
  uploadProductMixOfImages,
};
