;
function Agent() {
  var data = require("./Data.js");
  this.User = dataTypes.User;
  this.Post = dataTypes.Post;
  this.Script = require("./script.js");
  this.bot = new Script();
  this.users = [];
  this.posts = [];
}

Agent.prototype.init = function(subreddit) {
  //All asynchronous with callbacks
  this.bot.reddit.auth().then(buildPosts(subreddit))
  .then(reRank()).then(function() {
    this.bot.reddit.deauth();
  }).done();
};

Agent.prototype.buildPosts = function(subreddit) {
  this.bot.reddit("/r/$subreddit/new").listing({
    $subreddit = subreddit,
    limit : 50
  }).then(function(slice) {
    slice.children.forEach(function(item, i) {
      console.log("Item #" + i);
      for (prop in item) {
        if (item.hasOwnProperty(prop))
          console.log("\t" + prop);
      }
    })}).done();
};

Agent.prototype.reRank = function() {

};

init("funny");

module.exports = Agent;