function Script() {
  var config = require("./config");
  this.Snoocore = require("snoocore");
  this.reddit = new this.Snoocore(config);
}

module.exports = Script;