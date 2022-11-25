require("dotenv/config");

const { expressjwt: expressJwt } = require("express-jwt");
const secret = process.env.SECRET;

function authJwt() {
  return expressJwt({
    secret,
    algorithms: ["HS256"],
  });
}

module.exports = authJwt;
