const express = require('express');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getUserPosts,
  editPost,
  deletePost,
  likePost,
  unlikePost,
} = require('../Controllers/postController');
const { protect } = require('../Middleware/authMiddleware');
const upload = require('../Middleware/uploadMiddleware');

// Create a new post with optional image upload
router.post('/create', protect, upload.single('image'), createPost);

// Get all posts (public feed or protected depending on your design)
// If you want posts visible to everyone, remove `protect` here
router.get('/all', protect, getAllPosts);

// Get posts by the logged-in user
router.get('/user', protect, getUserPosts);

// Edit a post (only author can edit)
router.put('/edit/:id', protect, upload.single('image'), editPost);

// Delete a post (only author can delete)
router.delete('/delete/:id', protect, deletePost);

// Like a post
router.put('/like/:id', protect, likePost);

// Unlike a post
router.put('/unlike/:id', protect, unlikePost);

module.exports = router;
