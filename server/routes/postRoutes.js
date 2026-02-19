const express = require("express");
const router = express.Router();

//Controller
const {
  setPost,
  //   updatePost,
  //   deletePost,
  //   getPosts,
  //   getAllPostsByUserId,
  //   getAllPostsByUserName,
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
  setPost
);

// router.put("/:id", autGuard, postPhotoUpdateValidation(), validate, updatePost);
// router.delete("/:id", autGuard, deletePost);
// router.get("/:id", autGuard, validate, getPosts);
// router.get("/timeline/:userId", autGuard, validate, getAllPostsByUserId);
// router.get("/profile/:userName", autGuard, validate, getAllPostsByUserName);

module.exports = router;
