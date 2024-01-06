const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const User = require("../models/userModel");
const {
  checkPermission,
  attachCookieToResponse,
  createUserPayload,
} = require("../utils");

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ count: users.length, users });
};
const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(
      `no user found with id ${req.params.id}`
    );
  }
  checkPermission(req.params.id, req.user);
  res.status(StatusCodes.OK).json({ user });
};
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};
const updateUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new CustomError.BadRequestError("please provide all values");
  }
  const user = await User.findOne({ _id: req.user.userId });

  checkPermission(user._id, req.user);
  user.name = name;
  user.email = email;

  await user.save();

  const payload = createUserPayload(user);
  attachCookieToResponse({ res, payload });

  res.status(StatusCodes.OK).json({ user });
};
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide all fields.");
  }

  const user = await User.findOne({ _id: req.user.userId });

  const isCorrectPassword = await user.comparePassword(oldPassword);

  if (!isCorrectPassword) {
    throw new CustomError.UnAuthenticatedError("invalide credentials");
  }

  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Success! Password Updated." });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
