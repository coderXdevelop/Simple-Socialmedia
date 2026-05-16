const User = require('../Models/User');
const { uploadToDrive, deleteFromDrive } = require('../Utils/googleDrive');

// GET /api/user/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('posts');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const userObj = user.toObject();
    // Normalize avatar field (string or object)
    userObj.avatar =
      typeof userObj.avatar === 'object'
        ? userObj.avatar?.url || ''
        : userObj.avatar;

    res.json(userObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/user/avatar
const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.avatar && typeof user.avatar === 'object' && user.avatar.fileId) {
      try {
        await deleteFromDrive(user.avatar.fileId);
      } catch (deleteError) {
        console.warn('Failed to delete old avatar:', deleteError.message || deleteError);
      }
    }

    const { fileId, url } = await uploadToDrive(req.file);
    user.avatar = { fileId, url };
    await user.save();

    res.json({ avatar: user.avatar, message: 'Avatar updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.avatar && typeof user.avatar === 'object' && user.avatar.fileId) {
      await deleteFromDrive(user.avatar.fileId);
    }

    user.avatar = '';
    await user.save();

    res.json({ avatar: '', message: 'Avatar deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { displayName, age } = req.body;
    if (!displayName || !age) {
      return res.status(400).json({ message: 'Display name and age are required' });
    }

    const parsedAge = Number(age);
    if (!Number.isFinite(parsedAge) || parsedAge < 1 || parsedAge > 120) {
      return res.status(400).json({ message: 'Please enter a valid age' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.displayName = displayName;
    user.age = parsedAge;
    await user.save();

    res.json({ message: 'Profile updated successfully', displayName: user.displayName, age: user.age });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateAvatar, deleteAvatar, updateProfile };
