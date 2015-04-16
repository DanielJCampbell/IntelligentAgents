function Reader() {
	this.types = require("./Types.js");
	this.Script = require("./script.js");
	this.when = require("when");
	this.bot = new this.Script();
	this.Post = this.types.post;
	this.User = this.types.user;
	this.posts = [];
	this.users = [];
}

//Returns an promise containing an array of post information, allowing for reranking
Reader.prototype.read = function(subreddit) {
	var agent = this;
	var promise = this.readSub(subreddit);
	promise = this.readUsers(promise);

	//Attach the users to the posts, then return the array of posts
	return promise.then(function(promises) {
		return agent.when.all(promises).then(function() {
			agent.bot.reddit.deauth();
			agent.posts.forEach(function(item)) {
				item.user = agent.users[item.userID]; 
			}
			return agent.posts;
		});
	});
};

//Returns a promise - when fulfilled, the promise evaluates to
//an array of posts from the given subreddit
Reader.prototype.readSub = function(subreddit) {
	var Post = this.Post;
	return this.bot.reddit("/r/$subreddit/new").listing({
		$subreddit : subreddit,
		limit : 25
	}).then(function (slice) {
		var promises = [];
		slice.children.forEach(function(item) {
			var data = item.data;
			if (!data.is_self) {
				promises.push(new Post(data.id, data.ups, data.downs, data.author, data.permalink));
			}
		});
		return promises;
	});
}

//Return a promise - when that promise is fulfilled, evaluates to
//an array of promises. When those are fulfilled, the posts and users arrays are completed.
Reader.prototype.readUsers = function(promise) {
	var agent = this;
	return promise.then(function(array) {

		//Get distinct users, populate posts array, populate array of user promises
		var usernames = [];
		var users = [];
		array.forEach(function(item) {
			var username = item.username;
			agent.posts.push(item);
			var index = usernames.indexOf(username);
			if (index === -1) {
				item.userID = usernames.length;
				usernames.push(username);
				users.push(agent.bot.reddit("/user/"+username+"/about.json").get().then(function(result) {
					var data = result.data;
					agent.users.push(new agent.User(data.comment_karma, data.link_karma));
				}));
			}
			else {
				item.userID = index;
			}
		});
		return users;
	});
};

module.exports = Reader;