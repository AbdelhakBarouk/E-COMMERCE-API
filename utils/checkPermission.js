const CustomError = require("../errors");

const checkPermission = (resourceId, currentUser) => {
  if (currentUser.role === "admin") return;
  if (currentUser.userId === resourceId.toString()) return;
  throw new CustomError.UnAuthorizedError(
    "Not authorized to access this route"
  );
};

module.exports = checkPermission;
