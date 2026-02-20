class Post {
  constructor({ title, img, body, tags, userId, createdBy, createdAt }) {
    this.title = title;
    this.img = img;
    this.body = body;
    this.tags = tags;
    this.userId = userId;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
  }
}

module.exports = Post;
