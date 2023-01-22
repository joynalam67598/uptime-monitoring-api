//dependencies
const http = require("http");
const { handleReqRes } = require("./helper/handleReqRes");
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
app.handleReqRes = handleReqRes;

//start server
app.createServer();
