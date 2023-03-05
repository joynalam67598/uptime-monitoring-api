//dependencies
const data = require("../../lib/data");
const hash = require("../../helpers/utilities");
const createRandomString = require("../../helpers/utilities");
const { user } = require("../../routes");
const { parseJSON } = require("../../helpers/utilities");

//module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
  callback(200, {
    message: "This is user url",
  });
};

handler._token = {};

handler._token.get = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length() == 20
      ? requestProperties.queryStringObject.id
      : false;
  if (id) {
    data.read("tokens", id, (err, tokenData) => {
      const token = { ...parseJSON(tokenData) };
      //file exists
      if (!err && token) {
        //store data
        callback(200, token);
      } else {
        callback(500, {
          error: "Server error.",
        });
      }
    });
  } else {
    callback(404, {
      error: "token not found",
    });
  }
};
handler._token.post = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length() == 11
      ? requestProperties.body.phone
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length() == 11
      ? requestProperties.body.password
      : false;

  if (phone && password) {
    data.read("users", phone, (err, userData) => {
      let hashedPassword = hash(password);
      if (hashedPassword === parseJson(userData).password) {
        let tokenId = createRandomString(20);
        let expires = Date.now() + 60 * 60 * 1000;
        let tokenObject = {
          phone,
          id: tokenId,
          expires,
        };

        //store the token
        data.create("tokens", tokenId, tokenObject, (err) => {
          if (!err) {
            callback(200, tokenObject);
          } else {
            callback(400, {
              error: "Problem in server",
            });
          }
        });
      } else {
        callback(404, {
          error: "password not valid",
        });
      }
    });
  } else {
    callback(400, {
      error: "Problem in Request",
    });
  }
};
handler._token.put = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length() == 20
      ? requestProperties.queryStringObject.id
      : false;
  const extend =
    typeof requestProperties.queryStringObject.extend === "boolean" &&
    requestProperties.queryStringObject.extend
      ? true
      : false;

  if (id && extend) {
    data.create("tokens", id, tokenObject, (err, tokenData) => {
      let tokenObject = parseJson(tokenData).expires;
      if (tokenObject.expires > Date.now()) {
        tokenObject.expires = Date.now() + 60 * 60 * 1000;
        data.update("tokens", id, (err) => {
          if (!err) {
            callback(200);
          } else {
            callback(400, {
              error: "Problem in server",
            });
          }
        });
      } else {
        callback(400, {
          error: "Problem in server",
        });
      }
    });
  } else {
    callback(400, {
      error: "Problem in Request",
    });
  }
};
handler._token.delete = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length() == 20
      ? requestProperties.queryStringObject.id
      : false;
  if (id) {
    data.read("users", id, (err, tokenData) => {
      //file exists
      if (!err && tokenData) {
        data.read("tokens", id, (err) => {
          if (!err) {
            data.delete();
            callback(200, { message: "Token was deleted successfully!" });
          } else {
            callback(500, {
              error: "Server error.",
            });
          }
        });
      } else {
        callback(500, {
          error: "Server error.",
        });
      }
    });
  } else {
    callback(404, {
      error: "User not found",
    });
  }
};

handler._token.verify = (id, phone, callback) => {
  data.read("tokens", id, (err, tokenData) => {
    if (
      !err &&
      tokenData &&
      parseJSON(tokenData).expires <= Date.now() &&
      parseJSON(tokenData).phone == phone
    ) {
      callback(true);
    } else {
      callback(false);
    }
  });
};
module.exports = handler;
