const User = require("../models/userModel");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { createUserPayload, attachCookieToResponse } = require("../utils");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new CustomError.BadRequestError("Please provide all values!");
  }

  const isFirstRegistredUser = (await User.countDocuments()) === 0;
  const role = isFirstRegistredUser ? "admin" : "user";

  const user = await User.create({ name, email, password, role });

  //token part
  const payload = createUserPayload({ user });
  attachCookieToResponse({ res, payload });
  res.status(StatusCodes.OK).json({ user });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please Provide all values!");
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    throw new CustomError.UnAuthenticatedError("invalide credentials");
  }

  const isCorrectPassword = await user.comparePassword(password);
  if (!isCorrectPassword) {
    throw new CustomError.UnAuthenticatedError("invalide credentials");
  }

  //token part
  const payload = createUserPayload(user);
  attachCookieToResponse({ res, payload });

  res.status(StatusCodes.OK).json({ user: payload });
};
const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
    signed: true,
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out" });
};

module.exports = { register, login, logout };
