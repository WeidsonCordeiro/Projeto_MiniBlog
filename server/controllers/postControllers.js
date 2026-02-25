const Post = require("../models/Post");
const { db } = require("../config/firebase");
const deleteImage = require("../utils/deleteImage");

//Register Post
const setPost = async (req, res) => {
  try {
    const { title, body, tags } = req.body;
    const img = req.file ? req.file.filename : null;

    const newPost = Post.build({
      title,
      img,
      body,
      tags,
      userId: req.user.uid,
      createdBy: req.user.name,
    });

    const docRef = await db.collection("posts").add(newPost);

    res.status(201).json({
      message: "Post registado com sucesso",
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
    const postId = req.params.id;
    const { title, body, tags } = req.body;
    const img = req.file ? req.file.filename : null;

    const postRef = db.collection("posts").doc(postId);
    const postSnap = await postRef.get();

    if (!postSnap.exists) {
      return res.status(404).json({ errors: ["Post não encontrado!"] });
    }

    const postData = postSnap.data();

    if (postData.userId !== req.user.uid) {
      return res
        .status(403)
        .json({ errors: ["Você não tem permissão para atualizar este Post!"] });
    }

    // Ensure there is something to update
    if (!title && !body && !tags && !img) {
      return res
        .status(400)
        .json({ errors: ["Nenhuma informação foi enviada para atualizar!"] });
    }

    const updateData = Post.buildUpdate({
      title,
      body,
      tags,
      img,
    });

    await postRef.update(updateData);

    const updatedPost = await postRef.get();

    res.status(200).json({
      message: "Post atualizado com sucesso",
      post: {
        id: updatedPost.id,
        ...updatedPost.data(),
      },
    });
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
    const postId = req.params.id;
    const postRef = db.collection("posts").doc(postId);
    const postSnap = await postRef.get();

    if (!postSnap.exists) {
      return res.status(404).json({ errors: ["Post não encontrado!"] });
    }

    const postData = postSnap.data();

    if (postData.userId !== req.user.uid) {
      return res
        .status(403)
        .json({ errors: ["Você não tem permissão para remover este Post!"] });
    }

    await deleteImage("posts", postData.img);
    await postRef.delete();

    res.status(200).json({
      message: "Post removido com sucesso",
      postId,
    });
  } catch (error) {
    console.error("Erro ao remover Post:", error);
    return res
      .status(500)
      .json({ errors: ["Erro ao remover Post!"], details: error.message });
  }
};

//Get Post
const getAllPosts = async (req, res) => {
  try {
    const snapshot = await db
      .collection("posts")
      .orderBy("createdAt", "desc")
      .get();

    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      posts,
      total: posts.length,
    });
  } catch (error) {
    console.error("Erro ao buscar Posts:", error);
    return res.status(500).json({
      errors: ["Erro ao buscar Posts!"],
      details: error.message,
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;

    const postRef = db.collection("posts").doc(postId);
    const postSnap = await postRef.get();

    if (!postSnap.exists) {
      return res.status(404).json({ errors: ["Post não encontrado!"] });
    }

    return res.status(200).json({
      post: {
        id: postSnap.id,
        ...postSnap.data(),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar Post:", error);
    return res.status(500).json({
      errors: ["Erro ao buscar Post!"],
      details: error.message,
    });
  }
};

const getMyPosts = async (req, res) => {
  try {
    const snapshot = await db
      .collection("posts")
      .where("userId", "==", req.user.uid)
      .orderBy("createdAt", "desc")
      .get();
    console.log(req.user.uid);
    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      posts,
      total: posts.length,
    });
  } catch (error) {
    console.error("Erro ao buscar Posts do usuário:", error);
    return res.status(500).json({
      errors: ["Erro ao buscar seus Posts!"],
      details: error.message,
    });
  }
};

module.exports = {
  setPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPostById,
  getMyPosts,
};
