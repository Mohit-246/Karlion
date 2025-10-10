const express = require("express");
const {
  createUser,
  authUser,
  getUserData,
  updateUserProfile,
  getUsers,
  deleteUser,
} = require("../controllers/userController");
const {
  signUp,
  signIn,
  isAuthenticated,
  isAdmin,
} = require("../middleware/auth");

const router = express.Router();

// Public routes
router.post("/register", signUp, createUser);
router.post("/login", signIn, authUser);

// Protected routes
router
  .route("/profile/:id")
  .get(isAuthenticated, getUserData)
  .put(isAuthenticated, updateUserProfile);

// Admin routes
router.route("/").get(isAuthenticated, isAdmin, getUsers);

router.route("/:id").delete(isAuthenticated, isAdmin, deleteUser);

module.exports = router; // ✅ Must use module.exports in CommonJS
