const express = require('express');
const router = express.Router();
const { getProfile, updateAvatar, deleteAvatar, updateProfile } = require('../Controllers/userController');
const { protect } = require('../Middleware/authMiddleware');
const upload = require('../Middleware/uploadMiddleware');

// Get logged-in user's profile
router.get('/profile', protect, getProfile);

// Update basic profile details
router.put('/profile', protect, updateProfile);

// Update avatar (uploads to Google Drive via controller)
router.put('/avatar', protect, upload.single('avatar'), updateAvatar);

// Delete current avatar
router.delete('/avatar', protect, deleteAvatar);

module.exports = router;
