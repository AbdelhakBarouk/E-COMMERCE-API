const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, res) => {
  const customError = {
    //set default error
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Somthing went wrong ! try again later",
  };

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
