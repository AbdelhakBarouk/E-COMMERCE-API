const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { isValideToken } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new CustomError.UnAuthenticatedError("Authentication Invalid");
  }

  //check if the token is valide
  try {
    const { name, userId, role } = isValideToken({ token });
    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new CustomError.UnAuthenticatedError("Authentication Invalid");
  }
};

const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnAuthorizedError(
        "Unauthorized to access this route"
      );
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermission };
