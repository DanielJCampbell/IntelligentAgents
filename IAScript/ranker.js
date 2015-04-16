function Ranker() {
	this.Reader = require("./reader.js");
	this.read = new this.Reader();
}

//Given a subreddit, returns a promise of a promise of an array of the
//25 newest posts ranked by poster's karma.
Ranker.prototype.predict = function(subreddit) {
	var promise = this.read.read(subreddit);
	var rank = this;

	return promise.then(function(when) {
		return when.then(function (posts) {
			posts.sort(rank.karmaRanker);
			console.log(posts);
			return posts;
		});
	});
};

Ranker.prototype.experiment = function(subreddit, numHours) {
	var rank = this;
	var promise = this.predict(subreddit);

	promise = promise.delay(1000*60*60*numHours);

	promise.then(function(prom) {

	});

};

Ranker.prototype.karmaRanker = function(postA, postB) {
	return postB.user.karma - postA.user.karma;
};

Ranker.prototype.scoreRanker = function(postA, postB) {
	return postB.score - postA.score;
};

new Ranker().predict("funny");