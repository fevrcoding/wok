module.exports = baseConfig => {
  const config = require("@wok-cli/preset-wok/config")(baseConfig);

  const targets = {
    staging: {},
    production: {}
  };


  return {
    ...config,
    targets,
  };
};
