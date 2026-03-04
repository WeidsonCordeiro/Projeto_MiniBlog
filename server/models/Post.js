class Post {
  static build({ title, img, publicId, body, tags, userId, createdBy }) {
    return {
      title,
      img,
      publicId,
      body,
      tags: tags || [],
      userId,
      createdBy,
      createdAt: new Date(),
    };
  }
  static buildUpdate({ title, body, tags }) {
    const updateData = {};

    if (title) updateData.title = title;
    if (body) updateData.body = body;
    if (tags) updateData.tags = tags;

    updateData.updatedAt = new Date();

    return updateData;
  }
}

module.exports = Post;
