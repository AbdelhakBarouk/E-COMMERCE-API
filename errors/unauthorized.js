const { StatusCodes } = require("http-status-codes");
const customAPIError = require("./custom-api");

class UnAuthorizedError extends customAPIError {
  constructor(message) {
    super(message);
    this.StatusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = UnAuthorizedError;
