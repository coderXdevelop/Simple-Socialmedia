const express = require('express');
const router = express.Router();
const { getProfile, updateAvatar } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/profile', protect, getProfile);
router.put('/avatar', protect, upload.single('avatar'), updateAvatar);

module.exports = router;
