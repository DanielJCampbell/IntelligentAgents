function Writer() {
	this.fs = require("fs");
}

//Given an object containing ranked and unranked posts
//Writes a line to the given file for every post, ordered by rank,
//containing the post url, author, author karma, and unordered position
Writer.prototype.writeRanking = function(result, filename) {
	var output = "";
	var newline = (process.platform === 'win32') ? "\n\r" : "\n";
	result.ranked.forEach(function(item, i) {
		if (i > 0) output += newline;
		output += (i+1) + ". URL: " + item.url;
		output += " Author: /u/" + item.username;
		output += "(" + item.user.karma + ")";
		var pos = 0;
		for (pos = 0; pos < result.old.length; pos++) {
			if (result.old[pos].id === item.id) {
				break;
			}
		}
		output += " Original index: " + (pos+1) + newline;
	});
	this.fs.writeFile(filename, output);
};

//As above, except ranked by score with predicted rank shown
//Also shows accuracy at bottom of file
Writer.prototype.writeTest = function(result, filename) {
	var output = "";
	var newline = (process.platform === 'win32') ? "\n\r" : "\n";
	result.actual.forEach(function(item, i) {
		if (i > 0) output += newline;
		output += (i+1) + ". URL: " + item.url;
		output += " Author: /u/" + item.username;
		output += "(" + item.user.karma + ")";
		var pos = 0;
		for (pos = 0; pos < result.ranked.length; pos++) {
			if (result.ranked[pos].id === item.id) {
				break;
			}
		}
		output += " Predicted index: " + (pos+1) + newline;
	});
	output += newline + "Ranking accuracy: " + (result.predAcc*100) + "%" + newline;
	output += newline + "Old accuracy: " + (result.oldAcc*100) + "%" + newline;
	output += newline + "Ranking precision (Top 10): " + (result.predPrec*100) + "%" + newline;
	output += newline + "Old precision (Top 10): " + (result.oldPrec*100) + "%" + newline;
	output += newline + "Ranking ARR: " + result.predARR + newline;
	output += newline + "Old ARR: " + result.oldARR;
	
	this.fs.writeFile(filename, output);
};

module.exports = Writer;