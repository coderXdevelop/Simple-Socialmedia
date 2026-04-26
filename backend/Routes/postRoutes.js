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
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/create', protect, upload.single('image'), createPost);
router.get('/all', protect, getAllPosts);
router.get('/user', protect, getUserPosts);
router.put('/edit/:id', protect, upload.single('image'), editPost);
router.delete('/delete/:id', protect, deletePost);
router.put('/like/:id', protect, likePost);
router.put('/unlike/:id', protect, unlikePost);

module.exports = router;
