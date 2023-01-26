//dependencies

//module scaffolding.
const environments = {};

environments.staging = {
  port: 3000,
  env_name: "staging",
};

environments.production = {
  port: 5000,
  env_name: "production",
};

// determine which environment was passed.
const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

//export corresponding environment object.
const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

//export module.
module.exports = environmentToExport;
