const { StatusCodes } = require("http-status-codes");
const customAPIError = require("./custom-api");

class NotFoundError extends customAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = NotFoundError;
