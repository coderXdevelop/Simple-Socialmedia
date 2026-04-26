# MERN Social Platform

A full-stack social media web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js).
The application allows users to register, authenticate securely, create posts, interact with other users’ content, and manage their profile.

---

## 🚀 Features

* User authentication using JWT and HTTP-only cookies
* Secure password hashing with bcrypt
* Create, edit, and delete posts
* Like and unlike posts
* View all users' posts (feed)
* Personal dashboard to manage your posts
* Upload and update user avatar
* Persistent login session
* Protected routes with middleware

---

## 🛠 Tech Stack

**Frontend:**

* React.js (Hooks, Functional Components)
* React Router
* Axios

**Backend:**

* Node.js
* Express.js
* MongoDB with Mongoose

**Authentication & Security:**

* JWT (JSON Web Tokens)
* cookie-parser
* bcrypt

---

## 📂 Project Structure

### Backend

* models/ → Mongoose schemas (User, Post)
* routes/ → API endpoints
* controllers/ → Business logic
* middleware/ → Authentication handling
* config/ → Database connection

### Frontend

* components/ → Reusable UI components
* pages/ → Route-based pages
* services/ → API calls
* context/ → Authentication state management

---

## 🔐 Authentication Flow

1. User registers or logs in
2. Server validates credentials
3. JWT is generated and stored in an HTTP-only cookie
4. Protected routes verify token via middleware
5. User remains logged in until logout

---

## 🌐 API Endpoints

### Auth

* POST /api/auth/register
* POST /api/auth/login
* GET  /api/auth/logout

### User

* GET  /api/user/profile
* PUT  /api/user/avatar

### Post

* POST   /api/post/create
* GET    /api/post/all
* GET    /api/post/user
* PUT    /api/post/edit/:id
* DELETE /api/post/delete/:id
* PUT    /api/post/like/:id
* PUT    /api/post/unlike/:id

---

## 📸 Screens (Optional)

(Add screenshots of UI here if available)

---

## ⚙️ Installation & Setup

### 1. Clone the repository

git clone https://github.com/your-username/mern-social-platform.git

### 2. Install dependencies

Backend:
cd backend
npm install

Frontend:
cd frontend
npm install

### 3. Environment Variables

Create a `.env` file in backend:

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key

### 4. Run the application

Backend:
npm run server

Frontend:
npm start

---

## ⚠️ Limitations

* Not optimized for large-scale usage
* Likes stored as arrays (not scalable for high traffic)
* Basic UI (focus is functionality)

---

## 🔮 Future Improvements

* Real-time notifications (Socket.io)
* Comment system
* Follow/unfollow users
* Image storage using Cloudinary
* Pagination and infinite scroll
* Better UI/UX design

---

## 📌 Conclusion

This project demonstrates full-stack development with authentication, CRUD operations, and RESTful API integration using the MERN stack.

---
