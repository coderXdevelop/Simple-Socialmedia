import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import UploadAvatar from './pages/UploadAvatar';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import YourPost from './pages/YourPost';
import ViewPost from './pages/ViewPost';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/profile" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/profile" replace /> : <Register />} />

        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/upload-avatar" element={<PrivateRoute><UploadAvatar /></PrivateRoute>} />
        <Route path="/create-post" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
        <Route path="/edit-post/:id" element={<PrivateRoute><EditPost /></PrivateRoute>} />
        <Route path="/your-post" element={<PrivateRoute><YourPost /></PrivateRoute>} />
        <Route path="/view-post" element={<PrivateRoute><ViewPost /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
