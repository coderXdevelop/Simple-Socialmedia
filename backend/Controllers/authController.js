const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const nodemailer = require('nodemailer');
const axios = require('axios');
const bcrypt = require('bcrypt');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Send email via Brevo HTTP API if `BREVO_API_KEY` is present, otherwise fallback to SMTP
const sendMail = async (email, subject, text) => {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    const fromEmail = process.env.BREVO_FROM_EMAIL || process.env.BREVO_USER || 'no-reply@myapp.local';
    const fromName = process.env.BREVO_FROM_NAME || 'MyApp';

    if (apiKey) {
      // Use Brevo (Sendinblue) SMTP API endpoint
      const payload = {
        sender: { name: fromName, email: fromEmail },
        to: [{ email }],
        subject,
        textContent: text,
        htmlContent: `<p>${text}</p>`,
      };

      const response = await axios.post('https://api.brevo.com/v3/smtp/email', payload, {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      console.log('Brevo API email sent, id:', response.data && response.data.messageId ? response.data.messageId : 'unknown');
      return;
    }

    // Fallback to existing SMTP transport (nodemailer)
    console.log('BREVO_API_KEY not set, falling back to SMTP relay for', email);
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
      },
    });

    const mailOptions = {
      from: fromEmail,
      to: email,
      subject,
      text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('SMTP email sent successfully:', result && result.messageId ? result.messageId : 'unknown');
  } catch (error) {
    console.error('Error sending email:', error && error.message ? error.message : error);
    console.error('Full error:', error);
  }
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.otp = null;
    user.otpExpires = null;
    user.isVerified = true; // mark account as verified
    await user.save();

    setTokenCookie(res, generateToken(user._id));

    return res.json({ message: 'Account verified successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// Set JWT in cookie
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { username, displayName, age, email, password } = req.body;

    if (!username || !displayName || !age || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const parsedAge = Number(age);
    if (!Number.isFinite(parsedAge) || parsedAge < 1 || parsedAge > 120) {
      return res.status(400).json({ message: 'Please enter a valid age' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const otp = generateOTP();

    const user = await User.create({
      username,
      displayName,
      age: parsedAge,
      email,
      password,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    // For testing: log OTP to console
    console.log(`TEST OTP for ${email}: ${otp}`);

    await sendMail(email, 'Your OTP Code', `Your OTP code is: ${otp}`);

    res.status(201).json({
      message: 'User registered. Please check your email for the OTP to verify your account.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email first' });
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.json({
      _id: user._id,
      username: user.username,
      displayName: user.displayName,
      age: user.age,
      email: user.email,
      avatar: user.avatar || '',
      posts: user.posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/logout
const logout = (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.json({ message: 'Logged out successfully' });
};

module.exports = { register, login, logout, verifyOTP };
