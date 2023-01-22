//dependencies
const url = require("url");
const { StringDecoder } = require("string_decoder");

//Module ecaffolding
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

  req.on("data", (buffer) => {
    orginalData += decoder.write(buffer);
  });

  req.on("end", () => {
    orginalData += decoder.end();
    // after firing end event then we get the full data.
    console.log(orginalData);
    res.end("Hello");
  });
};

module.exports = handler;
