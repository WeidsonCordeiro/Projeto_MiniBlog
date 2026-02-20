const Post = require("../models/Post");
const { db } = require("../config/firebase");

//Register Post
const setPost = async (req, res) => {
  console.log("setPost :", req.user);
  try {
    // Validate request body
    const { title, body, tags } = req.body;
    const img = req.file ? req.file.filename : null;

    // Create new post
    const newPost = new Post({
      title,
      img,
      body,
      tags: tags || [],
      userId: req.user.uid,
      createdBy: req.user.name,
      createdAt: new Date(),
    });
    console.log("New Post:", newPost);
    const docRef = await db.collection("posts").add(newPost);

    console.log("Post registrado com sucesso! ID:", docRef);

    res.status(201).json({
      id: docRef.id,
      ...newPost,
    });
  } catch (error) {
    console.error("Erro ao registar Post:", error);
    return res
      .status(500)
      .json({ errors: ["Erro ao registar Post!"], details: [error.message] });
  }
};

//Update Post
const updatePost = async (req, res) => {
  try {
    // Validate request body
    const { userId, description } = req.body;
    const img = req.file ? req.file.filename : null;
    const { id } = req.params;

    // Check if post ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).json({ errors: ["ID do Post inválido!"] });
    }

    // Check if post exists
    const postExists = await Post.findById(id);

    if (!postExists) {
      return res.status(404).json({ errors: ["Post não encontrado!"] });
    }

    // Check if user is authorized to update the post
    if (postExists.userId !== userId) {
      return res
        .status(403)
        .json({ errors: ["Você não tem permissão para atualizar este Post!"] });
    }

    // Ensure there is something to update
    if (!description && !img) {
      return res
        .status(400)
        .json({ errors: ["Nenhuma informação foi enviada para atualizar!"] });
    }

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $set: { description, img } },
      { new: true } // Return the updated document
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Erro ao atualizar Post:", error);
    return res
      .status(500)
      .json({ errors: ["Erro ao atualizar Post!"], details: error.message });
  }
};

//Delete Post
const deletePost = async (req, res) => {
  try {
    // Validate request body
    const { userId } = req.body;
    const { id } = req.params;

    // Check if post ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).json({ errors: ["ID do Post inválido!"] });
    }

    // Check if post exists
    const postExists = await Post.findById(id);

    if (!postExists) {
      return res.status(404).json({ errors: ["Post não encontrado!"] });
    }

    // Check if user is authorized to delete the post
    if (postExists.userId !== userId) {
      return res
        .status(403)
        .json({ errors: ["Você não tem permissão para remover este Post!"] });
    }

    // Delete the post
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(500).json({ errors: ["Erro ao remover o Post!"] });
    }

    res
      .status(200)
      .json({ message: "Post removido com sucesso!", deletedPost });
  } catch (error) {
    console.error("Erro ao remover Post:", error);
    return res
      .status(500)
      .json({ errors: ["Erro ao remover Post!"], details: error.message });
  }
};

//Get Post
const getPosts = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if post ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).json({ errors: ["ID do Post inválido!"] });
    }

    // Check if post exists
    const postExists = await Post.findById(id);

    if (!postExists) {
      return res.status(404).json({ errors: ["Post não encontrado!"] });
    }

    return res.status(200).json(postExists);
  } catch (error) {
    console.error("Erro ao buscar Posts:", error);
    return res.status(500).json({
      errors: ["Erro ao buscar Posts!"],
      details: error.message,
    });
  }
};

//Get Timeline Posts by UserId
const getAllPostsByUserId = async (req, res) => {
  try {
    const currentUserId = await User.findById(req.params.userId);

    if (!currentUserId) {
      return res.status(404).json({ errors: ["Usuário não encontrado!"] });
    }

    const userPosts = await Post.find({ userId: currentUserId._id }).sort({
      createdAt: -1,
    });

    const friendPosts = await Promise.all(
      currentUserId.followings.map((friendId) => {
        return Post.find({ userId: friendId }).sort({
          createdAt: -1,
        });
      })
    );

    return res.status(200).json(userPosts.concat(...friendPosts));
  } catch (error) {
    console.error("Erro ao buscar timeline Posts by UserId:", error);
    return res.status(500).json({
      errors: ["Erro ao buscar timeline Posts by UserId!"],
      details: error.message,
    });
  }
};

module.exports = {
  setPost,
  updatePost,
  deletePost,
  getPosts,
  getAllPostsByUserId,
};
