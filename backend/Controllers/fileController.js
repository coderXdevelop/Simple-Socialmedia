const { getDriveFileStream } = require('../Utils/googleDrive');

const streamDriveFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { stream, headers } = await getDriveFileStream(fileId);

    if (headers['content-type']) {
      res.set('Content-Type', headers['content-type']);
    }
    res.set('Cache-Control', 'public, max-age=3600');
    stream.pipe(res);
  } catch (error) {
    console.error('Drive file stream error:', error.message || error);
    res.status(500).json({ message: 'Unable to load Drive image' });
  }
};

module.exports = { streamDriveFile };