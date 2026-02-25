const express = require("express");
const router = express.Router();

//Controller
const {
  setPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPostById,
  getMyPosts,
} = require("../controllers/postControllers");

//Middleware
const autGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");
const { imageUpload } = require("../middlewares/imageUpload");
const {
  postPhotoInsertValidation,
  postPhotoUpdateValidation,
} = require("../middlewares/postPhotoValidation");

//Routes
router.post(
  "/register",
  autGuard,
  imageUpload.single("img"),
  postPhotoInsertValidation(),
  validate,
  setPost,
);
router.get("/", validate, getAllPosts);
router.get("/myPosts", autGuard, validate, getMyPosts);
router.put("/:id", autGuard, postPhotoUpdateValidation(), validate, updatePost);
router.delete("/:id", autGuard, deletePost);
router.get("/:id", autGuard, validate, getPostById);

module.exports = router;
