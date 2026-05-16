const { google } = require('googleapis');
const { Readable } = require('stream');
const path = require('path');

const oauthClientId = process.env.GDRIVE_OAUTH_CLIENT_ID;
const oauthClientSecret = process.env.GDRIVE_OAUTH_CLIENT_SECRET;
const oauthRefreshToken = process.env.GDRIVE_OAUTH_REFRESH_TOKEN;
const folderId = process.env.GDRIVE_FOLDER_ID;

const scopes = ['https://www.googleapis.com/auth/drive.file'];

let auth;
if (oauthClientId && oauthClientSecret && oauthRefreshToken) {
  const oauth2Client = new google.auth.OAuth2(oauthClientId, oauthClientSecret);
  oauth2Client.setCredentials({ refresh_token: oauthRefreshToken });
  auth = oauth2Client;
  console.log('Google Drive: using OAuth2 credentials from environment.');
} else {
  console.warn('Google Drive: OAuth2 environment variables missing. Falling back to service account auth.');
  auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, '../Config/project-68ad2f01-749c-49ac-a59-002f819c09cf.json'),
    scopes,
  });
}

const drive = google.drive({ version: 'v3', auth });

function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

const uploadToDrive = async (file) => {
  const fileMetadata = {
    name: `${Date.now()}-${file.originalname}`,
    ...(folderId ? { parents: [folderId] } : {}),
  };

  const media = {
    mimeType: file.mimetype,
    body: bufferToStream(file.buffer),
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: 'id, webViewLink, webContentLink',
  });

  const fileId = response.data.id;
  const url = `https://drive.google.com/uc?export=view&id=${fileId}`;

  if (fileId) {
    try {
      await drive.permissions.create({
        fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
    } catch (permissionError) {
      console.warn('Unable to make Drive file public:', permissionError.message || permissionError);
    }
  }

  return {
    fileId,
    url,
  };
};

const getDriveFileStream = async (fileId) => {
  const response = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'stream' }
  );

  return {
    stream: response.data,
    headers: response.headers || {},
  };
};

const deleteFromDrive = async (fileId) => {
  try {
    await drive.files.delete({ fileId });
  } catch (error) {
    console.error('Google Drive delete error:', error.message || error);
  }
};

module.exports = {
  uploadToDrive,
  getDriveFileStream,
  deleteFromDrive,
};
