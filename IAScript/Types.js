function Post(id, up, down, u, url) {
  this.id = id;
  this.upvotes = up;
  this.downvotes = down;
  this.score = up - down;
  this.user = u;
  this.userCK = 0;
  this.userLK = 0;
  this.userKarma = 0;
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