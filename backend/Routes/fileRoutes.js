const express = require('express');
const router = express.Router();
const { streamDriveFile } = require('../Controllers/fileController');

// Proxy Google Drive file content through the backend to avoid CSP/image restrictions.
router.get('/drive/:fileId', streamDriveFile);

module.exports = router;
