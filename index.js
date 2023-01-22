//dependencies
const http = require("http");
const url = require("url");
const { StringDecoder } = require("string_decoder");
const fs = require("fs");

//app object - module scaffolding
const app = {};

//configuration
app.config = {
  port: 3000,
};

//create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(app.config.port, () => {
    console.log(`Listening to post ${app.config.port}`);
  });
};

//handle request response
app.handleReqRes = (req, res) => {
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

  //response handle
  //res.end("Hell");
};

//start server
app.createServer();
