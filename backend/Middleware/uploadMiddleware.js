const multer = require('multer');

// Multer memory storage (keeps file in RAM)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
