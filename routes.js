//dependencies
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");
const { userHandler } = require("./handlers/routeHandlers/userHandler");

// module scaffolding
const routes = {
  // 'routeName' : 'functionName'
  sample: sampleHandler,
  user: userHandler,
};

module.exports = routes;
