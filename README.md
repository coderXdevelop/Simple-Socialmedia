# Luminary - MERN Stack Social Media App

A full-stack social media application built with the MERN stack (MongoDB, Express.js, React, Node.js).

Users can register, log in, create and manage posts, upload avatars, like/unlike posts, and use OTP-based email verification for secure access.

## Key Features

- User registration, login, and protected routes
- OTP verification for email-based authentication
- Create, edit, delete posts with optional image uploads
- Like and unlike posts
- Upload and update user avatars
- Public feed and user-specific post views
- Google Drive integration for storing uploaded files
- JWT-based authentication and secure backend routes
- Responsive React frontend with client-side routing

## Why this Project

This project demonstrates a complete end-to-end web application with:
- A React frontend handling user interactions and protected pages
- An Express API server with authentication and file upload handling
- MongoDB as the persistence layer for users and posts
- Third-party integration for email and cloud file storage

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Multer
- Nodemailer
- Google Drive API
- Helmet
- CORS

### Frontend
- React
- React Router
- Axios
- CSS

## Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- npm (included with Node.js)
- Git
- MongoDB (local or hosted via MongoDB Atlas)

## Clone and Run

### 1. Clone the repository

```bash
git clone <repository-url>
cd Project-App
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure environment variables

Create a `.env` file inside `backend` with values for the following variables:

```env
MONGO_URI=mongodb://localhost:27017/luminary
JWT_SECRET=your-jwt-secret
BREVO_USER=your-brevo-email@example.com
BREVO_PASS=your-brevo-smtp-password
CLIENT_URL=http://localhost:3000
GDRIVE_FOLDER_ID=your-google-drive-folder-id
```

If you use MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

## Google Drive Setup (Optional)

If you want file uploads to go to Google Drive:

1. Enable the Google Drive API in Google Cloud Console.
2. Create a Service Account and download the JSON key file.
3. Place the JSON file in `backend`.
4. Update the `keyFile` path in the backend controllers that upload files.
5. Use a Google Drive folder ID for `GDRIVE_FOLDER_ID`.

## Run the Application

### Backend

From `backend`:

```bash
npm run dev
```

The backend will run on `http://localhost:5000` by default.

### Frontend

From `frontend`:

```bash
npm start
```

The frontend will run on `http://localhost:3000`.

## Run on another device

To run this project on another computer:

1. Install Node.js, npm, Git, and MongoDB.
2. Clone the repository.
3. Install dependencies in both `backend` and `frontend`.
4. Create the `backend/.env` file with your own configuration.
5. Start MongoDB (or use a cloud MongoDB URI).
6. Start the backend and frontend with `npm run dev` and `npm start`.

## Project Structure

```
Project-App/
├── backend/
│   ├── Config/
│   │   └── db.js
│   ├── Controllers/
│   │   ├── authController.js
│   │   ├── fileController.js
│   │   ├── postController.js
│   │   └── userController.js
│   ├── Middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── Models/
│   │   ├── Post.js
│   │   └── User.js
│   ├── Routes/
│   │   ├── authRoutes.js
│   │   ├── fileRoutes.js
│   │   ├── postRoutes.js
│   │   └── userRoutes.js
│   ├── package.json
│   ├── server.js
│   └── .env (create this)
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── PostCard.js
│   │   │   └── PrivateRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── CreatePost.js
│   │   │   ├── EditPost.js
│   │   │   ├── EditProfile.js
n│   │   │   ├── Login.js
│   │   │   ├── Profile.js
│   │   │   ├── Register.js
│   │   │   ├── UploadAvatar.js
│   │   │   ├── VerifyOTP.js
│   │   │   ├── ViewPost.js
│   │   │   └── YourPost.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Notes

- Make sure backend and frontend use matching URLs in `.env` and `frontend/package.json` proxy settings.
- Use a valid SMTP account for OTP email delivery.
- If you do not use Google Drive, file upload logic may need to be adjusted or disabled.