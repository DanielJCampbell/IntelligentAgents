;
function Agent() {
  var data = require("./Data.js");
  this.User = dataTypes.User;
  this.Post = dataTypes.Post;
  this.Sub = dataTypes.Subreddit;
  this.Script = require("./script.js");
  this.bot = new Script();
  this.users = [];
  this.posts = [];
  this.subs = [];
}

Agent.prototype.init = function(subreddit) {
  //All asynchronous with callbacks
  this.bot.reddit.auth().then(buildPosts(subreddit))
  .then(buildUsers()).then(reRank()).then(function() {
    this.bot.reddit.deauth();
  }).done();
};

Agent.prototype.buildPosts = function(subreddit) {
  this.bot.reddit()
};

Agent.prototype.buildUsers = function() {

};

Agent.prototype.reRank = function() {

};

module.exports = Agent;