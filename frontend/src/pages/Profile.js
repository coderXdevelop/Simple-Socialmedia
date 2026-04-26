import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../services/api';

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const backendUrl = 'http://localhost:5000';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getProfile();
        setProfile(data);
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!profile) return null;

  const avatarSrc = profile.avatar
    ? profile.avatar.startsWith('/uploads')
      ? `${backendUrl}${profile.avatar}`
      : profile.avatar
    : null;

  return (
    <div className="page">
      <div className="profile-hero">
        <div className="avatar-wrapper">
          {avatarSrc ? (
            <img src={avatarSrc} alt={profile.username} className="avatar" />
          ) : (
            <div className="avatar-placeholder">
              {profile.username[0].toUpperCase()}
            </div>
          )}
        </div>
        <div className="profile-info">
          <h2>@{profile.username}</h2>
          <p>{profile.email}</p>
          <span className="profile-stat">{profile.posts?.length || 0} posts</span>
        </div>
      </div>

      <div className="profile-actions">
        <Link to="/upload-avatar" className="btn btn-ghost">
          ◎ Upload Avatar
        </Link>
        <Link to="/create-post" className="btn btn-primary">
          + Create Post
        </Link>
        <Link to="/your-post" className="btn btn-ghost">
          ☰ Your Posts
        </Link>
        <Link to="/view-post" className="btn btn-ghost">
          ◈ Explore Feed
        </Link>
        <button onClick={handleLogout} className="btn btn-danger">
          ⎋ Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
