const $ = require("@wok-cli/core");
const preset = require("@wok-cli/preset-wok");

const wok = preset($);

module.exports = wok.resolve();
