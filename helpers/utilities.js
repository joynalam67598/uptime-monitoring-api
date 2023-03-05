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

//create random string
utilities.createRandomString = (size) => {
  let length = size;
  length = typeof size === "number" && size > 0 ? size : false;
  if (length) {
    let possibleChars = "abcdefghijklmnopqurstuvwxyz0123456789";
    let output = "";
    for (let i = 1; i <= length; i += 1) {
      let randomChar = possibleChars.charAt(
        Math.floor(Math.random() * possibleChars.length)
      );
      output += randomChar;
    }
  }
  return false;
};

//export module.
module.exports = utilities;
