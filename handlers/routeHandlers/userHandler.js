//dependencies
const data = require("../../lib/data");
const hash = require("../../helpers/utilities");
const { parseJSON } = require("../../helpers/utilities");
const tokenHandler = require("./tokenHandler");

//module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
  callback(200, {
    message: "This is user url",
  });
};

handler._users = {};

handler._users.get = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length() == 11
      ? requestProperties.queryStringObject.phone
      : false;
  if (phone) {
    // verify token
    let token =
      typeof requestProperties.headerObject.token === "string"
        ? requestProperties.headerObject.token
        : false;

    tokenHandler._token.verify(token, phone, (tokenFound) => {
      if (tokenFound) {
        //lookup user
        data.read("users", phone, (err, usr) => {
          const user = { ...parseJSON(usr) };
          //file exists
          if (!err && user) {
            //store data
            delete user.password;
            callback(200, user);
          } else {
            callback(500, {
              error: "Server error.",
            });
          }
        });
      } else {
        callback(403, {
          error: "User Authentication failed.",
        });
      }
    });
  } else {
    callback(404, {
      error: "User not found",
    });
  }
};
handler._users.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length() > 0
      ? requestProperties.body.firstName
      : false;
  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length() > 0
      ? requestProperties.body.lastName
      : false;

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

  const tosAgreement =
    typeof requestProperties.body.tosAgreement === "boolean" &&
    requestProperties.body.tosAgreement.trim().length() == 11
      ? requestProperties.body.tosAgreement
      : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    let token =
      typeof requestProperties.headerObject.token === "string"
        ? requestProperties.headerObject.token
        : false;

    tokenHandler._token.verify(token, phone, (tokenFound) => {
      if (tokenFound) {
        //check user already exists
        data.read("users", phone, (err, user) => {
          //file not exists
          if (err) {
            const userData = {
              firstName,
              lastName,
              phone,
              password: hash(password),
              tosAgreement,
            };

            //store data
            data.create("users", phone, userData, (err) => {
              if (!err) {
                callback(200, { message: "User was created successfully!" });
              } else {
                callback(500, { error: "Could not create user!" });
              }
            });
          } else {
            callback(500, {
              error: "Server error.",
            });
          }
        });
      } else {
        callback(403, {
          error: "User Authentication failed.",
        });
      }
    });
  } else {
    callback(400, {
      error: "Problem in Request",
    });
  }
};
handler._users.put = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length() == 11
      ? requestProperties.body.phone
      : false;

  if (phone) {
    const firstName =
      typeof requestProperties.body.firstName === "string" &&
      requestProperties.body.firstName.trim().length() > 0
        ? requestProperties.body.firstName
        : false;
    const lastName =
      typeof requestProperties.body.lastName === "string" &&
      requestProperties.body.lastName.trim().length() > 0
        ? requestProperties.body.lastName
        : false;

    const password =
      typeof requestProperties.body.password === "string" &&
      requestProperties.body.password.trim().length() == 11
        ? requestProperties.body.password
        : false;

    const tosAgreement =
      typeof requestProperties.body.tosAgreement === "boolean" &&
      requestProperties.body.tosAgreement.trim().length() == 11
        ? requestProperties.body.tosAgreement
        : false;
    if (firstName || lastName || password) {
      tokenHandler._token.verify(token, phone, (tokenFound) => {
        if (tokenFound) {
          data.read("users", phone, (err, usrData) => {
            const userData = { ...parseJSON(usrData) };
            if (!err) {
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }
              if (password) {
                userData.password = hash(password);
              }
              data.update("users", phone, userData, (err) => {
                if (!err) {
                  callback(200, { message: "User was updated successfully!" });
                } else {
                  callback(500, {
                    error: "Server error.",
                  });
                }
              });
            } else {
              callback(404, {
                error: "Invalid User",
              });
            }
          });
        } else {
          callback(403, {
            error: "User Authentication failed.",
          });
        }
      });
    } else {
      callback(400, {
        error: "Field required",
      });
    }
  } else {
    callback(404, {
      error: "Invalid User",
    });
  }
};
handler._users.delete = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length() == 11
      ? requestProperties.queryStringObject.phone
      : false;
  if (phone) {
    tokenHandler._token.verify(token, phone, (tokenFound) => {
      if (tokenFound) {
        data.read("users", phone, (err, data) => {
          //file exists
          if (!err && data) {
            data.read("users", phone, (err) => {
              if (!err) {
                data.delete();
                callback(200, { message: "User was deleted successfully!" });
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
        callback(403, {
          error: "User Authentication failed.",
        });
      }
    });
  } else {
    callback(404, {
      error: "User not found",
    });
  }
};

module.exports = handler;
