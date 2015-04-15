function Data(){}

Data.prototype.User = new function(id, lK, cK, p) {
  this.id = id;
  this.link = lk;
  this.comment = cK;
  this.karma = lk+ck;
  this.posts = (typeof p === 'undefined') ? [] : p;
};

Data.prototype.Post = new function(id, up, down, u) {
  this.id = id;
  this.upvotes = up;
  this.downvotes = down;
  this.score = up - down;
  this.user = u;
};

module.exports = Data;