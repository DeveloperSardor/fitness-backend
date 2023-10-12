const JsonWebToken = require("jsonwebtoken");
require("dotenv").config();
const JWT_PASS = process.env.JWT_KEY;

const JWT = {
  SIGN(payload) {
    return JsonWebToken.sign({ id: payload }, JWT_PASS, { expiresIn: "7d" });
  },
  VERIFY(token) {
    try {
      if (JsonWebToken.verify(token, JWT_PASS) instanceof Error)
        throw new Error("Expired token");
      else return JsonWebToken.verify(token, JWT_PASS);
    } catch (err) {
      return err.message;
    }
  },
};

module.exports = { JWT };
