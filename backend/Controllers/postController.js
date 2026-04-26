const Post = require('../models/Post');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// POST /api/post/create
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : '';

    const post = await Post.create({
      title,
      content,
      image,
      author: req.user._id,
    });

    await User.findByIdAndUpdate(req.user._id, { $push: { posts: post._id } });

    const populated = await post.populate('author', 'username avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/post/all
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username avatar')
      .populate('likes', 'username')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/post/user
const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .populate('author', 'username avatar')
      .populate('likes', 'username')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/post/edit/:id
const editPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    const { title, content } = req.body;
    if (title) post.title = title;
    if (content) post.content = content;

    if (req.file) {
      if (post.image && post.image.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', post.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      post.image = `/uploads/${req.file.filename}`;
    }

    await post.save();
    const populated = await post.populate('author', 'username avatar');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/post/delete/:id
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    if (post.image && post.image.startsWith('/uploads/')) {
      const imgPath = path.join(__dirname, '..', post.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await post.deleteOne();
    await User.findByIdAndUpdate(req.user._id, { $pull: { posts: post._id } });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/post/like/:id
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({ message: 'Post already liked' });
    }

    post.likes.push(req.user._id);
    await post.save();
    res.json({ likes: post.likes, message: 'Post liked' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/post/unlike/:id
const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
    await post.save();
    res.json({ likes: post.likes, message: 'Post unliked' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPost, getAllPosts, getUserPosts, editPost, deletePost, likePost, unlikePost };
