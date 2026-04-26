import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to={user ? '/profile' : '/'} className="navbar-brand">
        ✦ Luminary
      </Link>
      {user && (
        <div className="navbar-links">
          <Link to="/view-post" className="btn btn-ghost btn-sm">Explore</Link>
          <Link to="/your-post" className="btn btn-ghost btn-sm">My Posts</Link>
          <Link to="/profile" className="btn btn-ghost btn-sm">Profile</Link>
          <button onClick={handleLogout} className="btn btn-danger btn-sm">Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
