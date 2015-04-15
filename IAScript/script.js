function Script() {
  var config = require("./config");
  this.Snoocore = require("snoocore");
  this.reddit = new Snoocore(config);
}

module.exports = Script;


//reddit.auth().then(function() {
//	return reddit('/api/v1/me').get();
//}).then(function(data) {
//	console.log(data);
//}).then(function() {
//	reddit.deauth();
//}).done();