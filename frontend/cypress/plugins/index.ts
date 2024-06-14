const { isFileExist } = require("cy-verify-downloads");

module.exports = (on, config) => {
  on("task", { isFileExist });
};
