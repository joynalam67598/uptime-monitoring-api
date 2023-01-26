//dependencies
const http = require("http");
const { handleReqRes } = require("./helper/handleReqRes");
const environment = require("./helper/environments");
const fs = require("fs");

//app object - module scaffolding
const app = {};

//configuration
app.config = {};

//create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environment.port, () => {
    //NODE_ENV=production node start -> in console.
    //console.log(`Listening to post ${process.env.NODE_ENV}`);
    console.log(`Listening to port ${environment.port}`);
  });
};

//handle request response
app.handleReqRes = handleReqRes;

//start server
app.createServer();
