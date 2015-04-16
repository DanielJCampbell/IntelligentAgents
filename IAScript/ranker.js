function Ranker() {
	this.Reader = require("./reader.js");
	this.Script = require("./script.js");
	this.types = require("./Types.js");
	this.Post = this.types.post;
	this.bot = new this.Script();
	this.read = new this.Reader();
}

//Given a subreddit, returns a promise of an array of the
//25 newest posts ranked by poster's karma.
Ranker.prototype.predict = function(subreddit) {
	var promise = this.read.read(subreddit);
	var rank = this;

	return promise.then(function(posts) {
		posts.sort(rank.karmaRanker);
		return posts;
	});
};

Ranker.prototype.experiment = function(subreddit, delay) {
	var rank = this;
	var promise = this.predict(subreddit);

	promise = promise.delay(delay);

	return promise.then(function(array) {
		console.log(array);
		var list = "";

		array.forEach(function (item) {
			if (list === "") {
				list= list +("t3_"+item.id);
			}
			else {
				list = list + (",t3_"+item.id);
			}
		});
		return rank.bot.reddit("/by_id/"+list+".json").get().then(function(slice) {
			var oldRanked = array;
			var newRanked = [];
			slice.data.children.forEach(function(item) {
				var data = item.data;
				newRanked.push(new rank.Post(data.id, data.ups, data.downs, data.author, data.permalink));
			});
			newRanked.sort(rank.scoreRanker);
			return {
				old: oldRanked,
				current: newRanked
			};
		});
	});

};

Ranker.prototype.karmaRanker = function(postA, postB) {
	return postB.user.karma - postA.user.karma;
};

Ranker.prototype.scoreRanker = function(postA, postB) {
	return postB.score - postA.score;
};

new Ranker().experiment("funny", 30000);