function Post(id, up, down, u, url) {
  this.id = id;
  this.upvotes = up;
  this.downvotes = down;
  this.score = up - down;
  this.username = u;
  this.user = {};
  this.userID = -1;
  this.url = url;
}

function User(ck, lk) {
  this.commentK = ck;
  this.linkK = lk;
  this.karma = ck+lk;
}

module.exports = {
  post : Post,
  user : User
};