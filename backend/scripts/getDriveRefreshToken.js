const http = require('http');
const { google } = require('googleapis');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const CLIENT_ID = process.env.GDRIVE_OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.GDRIVE_OAUTH_CLIENT_SECRET;
const PORT = process.env.GDRIVE_OAUTH_REDIRECT_PORT || 3001;
const REDIRECT_PATH = '/oauth2callback';
const REDIRECT_URI = `http://localhost:${PORT}${REDIRECT_PATH}`;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Missing Google OAuth2 client credentials. Please set GDRIVE_OAUTH_CLIENT_ID and GDRIVE_OAUTH_CLIENT_SECRET in backend/.env.');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: ['https://www.googleapis.com/auth/drive.file'],
});

console.log('------------------------------------------------------------');
console.log('1) Open this URL in your browser:');
console.log(authUrl);
console.log('2) Sign in with the Google account you want to use for Drive uploads.');
console.log('3) After approval, copy the `code` query value from the browser URL.');
console.log(`4) The local server will also capture the code at ${REDIRECT_URI}`);
console.log('------------------------------------------------------------');

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://localhost:${PORT}`);
  if (requestUrl.pathname !== REDIRECT_PATH) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('Not found');
  }

  const code = requestUrl.searchParams.get('code');
  if (!code) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    return res.end('Missing authorization code.');
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Authorization complete</h1><p>You may close this tab and return to the terminal.</p>');

    console.log('\n=== Google Drive OAuth2 Tokens ===');
    console.log(`access_token: ${tokens.access_token}`);
    console.log(`refresh_token: ${tokens.refresh_token || 'NOT_RETURNED'}`);
    console.log(`scope: ${tokens.scope}`);
    console.log(`token_type: ${tokens.token_type}`);
    console.log(`expiry_date: ${tokens.expiry_date}`);

    if (tokens.refresh_token) {
      console.log('\nCopy this value into backend/.env:');
      console.log(`GDRIVE_OAUTH_REFRESH_TOKEN=${tokens.refresh_token}`);
    } else {
      console.warn('\nNo refresh_token was returned.');
      console.warn('Make sure you use prompt=consent, offline access, and a new Google account grant.');
    }
  } catch (error) {
    console.error('Failed to exchange code for tokens:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Failed to exchange code for tokens. Check the terminal for details.');
  } finally {
    server.close();
  }
});

server.listen(PORT, () => {
  console.log(`Listening for OAuth2 callback on http://localhost:${PORT}${REDIRECT_PATH}`);
});
