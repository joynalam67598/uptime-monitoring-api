//dependencies
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");

// module scaffolding
const routes = {
  // 'routeName' : 'functionName'
  sample: sampleHandler,
};

module.exports = routes;
