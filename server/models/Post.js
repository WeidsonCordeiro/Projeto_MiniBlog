class Post {
  constructor(title, image, body, tags, userId, createdBy) {
    this.title = title;
    this.image = image;
    this.body = body;
    this.tags = tags || [];
    this.userId = userId;
    this.createdBy = createdBy;
    this.createdAt = Timestamp.now();
  }
}

module.exports = Post;
