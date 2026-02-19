const express = require("express");
const router = express.Router(); // Use express.Router() for modular routing

// Define routes
// router.use("/api/users", require("./userRoutes"));
router.use("/api/posts", require("./postRoutes"));

// Test route under /api
router.get("/api", (req, res) => {
  res.send("API is working!");
});

module.exports = router;
