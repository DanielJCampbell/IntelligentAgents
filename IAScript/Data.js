function Data(){}

Data.prototype.User = new function(id, lK, cK, p) {
  this.id = id;
  this.link = lk;
  this.comment = cK;
  this.karma = lk+ck;
  this.posts = (typeof p === 'undefined') ? [] : p;
};

Data.prototype.Subreddit = new function(id, p) {
  this.id = id;
  this.posts = (typeof p === 'undefined') ? [] : p;
};

Data.prototype.Post = new function(id, sc, u, sr) {
  this.id = id;
  this.score = sc;
  this.user = u;
  this.sub = sr;
};

module.exports = Data;