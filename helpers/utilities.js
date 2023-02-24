//dependencies

//module scaffolding.
const crypto = require("crypto");
const utilities = {};
const environments = require("./environments");

//parse json string to object
utilities.parseJSON = (jsonString) => {
  let output;
  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }
  return output;
};

//hash string
utilities.hash = (password) => {
  if (typeof password === "string" && password.length > 0) {
    const hash = crypto
      .createHmac("sha256", environments.secretKey)
      .update(password)
      .digest("hex");
  } else {
    return false;
  }
};

//export module.
module.exports = utilities;
