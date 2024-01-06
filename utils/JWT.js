const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};
const isValideToken = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookieToResponse = ({ res, payload }) => {
  const token = createJWT({ payload });
  const oneDay = 24 * 60 * 60 * 1000;
  res.cookie("token", token, {
    httpOnly: true,
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });
};

module.exports = { createJWT, isValideToken, attachCookieToResponse };
