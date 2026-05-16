const express = require('express');
const router = express.Router();
const { register, login, logout, verifyOTP } = require('../Controllers/authController');

// Register new user (sends OTP to email)
router.post('/register', register);

// Verify OTP (auto‑login + cookie set handled inside controller)
router.post('/verify-otp', verifyOTP);

// Login existing user
router.post('/login', login);

// Logout user
router.post('/logout', logout);

module.exports = router;
