//dependencies
const http = require("http");
const { handleReqRes } = require("./helper/handleReqRes");
const environment = require("./helper/environments");
const data = require("./lib/data");

//app object - module scaffolding
const app = {};

//configuration
app.config = {};

//testing file system
//@TODO: erase later
data.create(
  "test",
  "new-file",
  { name: "Bangladesh", language: "Bangla" },
  (err) => {
    console.log("Error: ", err);
  }
);

data.read("test", "new-file", (err, result) => {
  console.log(err, result);
});

data.update("test", "new-file", { name: "US", language: "English" }, (err) => {
  console.log("Error: ", err);
});

data.read("test", "new-file", (err, result) => {
  console.log(err, result);
});

data.delete("test", "new-file", (err, result) => {
  console.log(err, result);
});

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
