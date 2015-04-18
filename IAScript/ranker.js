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
Ranker.prototype.predict = function(subreddit, limit) {
	var promise = this.read.read(subreddit, limit);
	var rank = this;

	return promise.then(function(posts) {
		var sorted = posts.slice();
		sorted.sort(rank.karmaRanker);
		return {
			old : posts,
			ranked : sorted
		};
	});
};

//Returns a promise of a promise of the array ranked two ways
Ranker.prototype.experiment = function(subreddit, limit, delay) {
	var rank = this;
	var promise = this.predict(subreddit, limit);

	promise = promise.delay(delay);

	return promise.then(function(result) {
		var array = result.ranked;
		var list = "";

		array.forEach(function (item) {
			if (list === "") {
				list= list +("t3_"+item.id);
			}
			else {
				list = list + (",t3_"+item.id);
			}
		});

		return rank.bot.reddit.auth().then(function() {
			return rank.bot.reddit("/by_id/"+list+".json").get({
				limit: 100
			});
		}).then(function(slice) {
			rank.bot.reddit.deauth().done();
			var newRanked = [];
			slice.data.children.forEach(function(item) {
				var data = item.data;
				newRanked.push(new rank.Post(data.id, data.ups, data.downs, data.author, data.permalink));
			});
			newRanked.sort(rank.scoreRanker);
			newRanked.forEach(function(post) {
				var i = 0;
				for (i = 0; i < newRanked.length; i++) {
					if (array[i].id === post.id) {
						post.user = array[i].user;
						break;
					}
				}
			});
			return {
				old: result.old,
				ranked: array,
				actual: newRanked
			};
		});
	});
};

Ranker.prototype.test = function(subreddit, limit, delay) {
	var promise = this.experiment(subreddit, limit, delay);

	return promise.then(function (result) {
		//For tracking number correctly placed
		var predCorrect = 0;
		var oldCorrect = 0;
		//For tracking top 10 precision (we assume the first 10 actual results are relevant)
		var predRelevant = 0;
		var oldRelevant = 0;
		//For tracking ARR (as above top 10 actual are relevant)
		var predARR = 0;
		var oldARR = 0;

		result.actual.forEach(function(item, i) {
			if (item.id === result.ranked[i].id) {
				predCorrect++;
			}
			if (item.id === result.old[i].id) {
				oldCorrect++;
			}
			if (i < 10) {
				var j = 0;
				for (j = 0; j < result.old.length; j++) {
					if (j < 10) {
						if (item.id === result.ranked[j].id) {
							predRelevant++;
						}
						if (item.id === result.old[j].id) {
							oldRelevant++;
						}
					}
					if (item.id === result.ranked[j].id) {
						predARR += (j+1);
					}
					if (item.id === result.old[j].id) {
						oldARR += (j+1);
					}
				}
			}
		});
		result.predAcc = (predCorrect > 0) ? predCorrect/result.actual.length : 0;
		result.oldAcc = (oldCorrect > 0) ? oldCorrect/result.actual.length : 0;
		result.predPrec = (predRelevant > 0) ? predRelevant/result.actual.length : 0;
		result.oldPrec = (oldRelevant > 0) ? oldRelevant/result.actual.length : 0;
		result.predARR = predARR/10;
		result.oldARR = oldARR/10;
		return result;
	});
} 

Ranker.prototype.karmaRanker = function(postA, postB) {
	return postB.user.karma - postA.user.karma;
};

Ranker.prototype.scoreRanker = function(postA, postB) {
	return postB.score - postA.score;
};

module.exports = Ranker;