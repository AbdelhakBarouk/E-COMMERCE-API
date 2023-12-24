const { StatusCodes } = require("http-status-codes");
const customAPIError = require("./custom-api");

class UnAuthenticatedError extends customAPIError {
  constructor(message) {
    super(message);
    this.StatusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnAuthenticatedError;
