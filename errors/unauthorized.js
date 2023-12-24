const { StatusCodes } = require("http-status-codes");
const customAPIError = require("./custom-api");

class UnAuthorizedError extends customAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = UnAuthorizedError;
