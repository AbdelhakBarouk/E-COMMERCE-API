const { StatusCodes } = require("http-status-codes");
const customAPIError = require("./custom-api");
class BadRequestError extends customAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
