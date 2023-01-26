//dependencies
const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes");
const {
  notFoundHandler,
} = require("../handlers/routeHandlers/notFoundHandler");

//Module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
  //request handling
  //get the url and parse it
  const parseUrl = url.parse(req.url, true); //true for include query string.
  const path = parseUrl.pathname;
  const trimedPath = path.replace(/^\/+|\/+$/g, ""); // to avoid start and ending / from path name.
  const method = req.method.toLowerCase();
  const queryStringObject = parseUrl.query; //query string add in path like perameters.
  const headersObject = req.headers;
  const decoder = new StringDecoder("utf-8");
  let orginalData = "";

  // to pass all data to choosenHandler.
  const requestProperties = {
    parseUrl,
    path,
    trimedPath,
    method,
    queryStringObject,
    headersObject,
  };

  const choosenHandler = routes[trimedPath]
    ? routes[trimedPath]
    : notFoundHandler;

  req.on("data", (buffer) => {
    orginalData += decoder.write(buffer);
  });

  req.on("end", () => {
    orginalData += decoder.end();
    // after firing end event then we get the full data.  
    choosenHandler(requestProperties, (statusCode, payload) => {
      // callback function
      // will call from choosen handler
      // to get the status and payload.
      statusCode = typeof statusCode === "number" ? statusCode : 500;
      payload = typeof payload === "object" ? payload : {};

      const payloadString = JSON.stringify(payload);

      // return the final response.
      res.writeHead(statusCode);
      res.end(payloadString); //at the end return the payload.
    });
    res.end("Hello");
  });
};

module.exports = handler;
