//dependencies
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");
const { userHandler } = require("./handlers/routeHandlers/userHandler");
const { tokenHandler } = require("./handlers/routeHandlers/tokenHandler");

// module scaffolding
const routes = {
  // 'routeName' : 'functionName'
  sample: sampleHandler,
  user: userHandler,
  token: tokenHandler,
};

module.exports = routes;
