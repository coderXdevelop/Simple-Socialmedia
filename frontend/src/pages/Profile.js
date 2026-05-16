import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfile, deleteAvatar } from '../services/api';

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const backendUrl = 'http://localhost:5000';

  const normalizeDriveUrl = (url) => {
    if (!url) return '';
    try {
      const parsed = new URL(url);
      if (parsed.hostname === 'drive.google.com') {
        const path = parsed.pathname.split('/');
        if (path[1] === 'file' && path[2] === 'd') {
          const fileId = path[3];
          return fileId ? `/api/file/drive/${fileId}` : url;
        }
        if (path[1] === 'uc') {
          const fileId = parsed.searchParams.get('id');
          return fileId ? `/api/file/drive/${fileId}` : url;
        }
      }
    } catch {
      return url;
    }
    return url;
  };

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

  const handleDeleteAvatar = async () => {
    try {
      await deleteAvatar();
      setProfile((prev) => ({ ...prev, avatar: '' }));
      setUser((prev) => (prev ? { ...prev, avatar: '' } : prev));
    } catch (err) {
      console.error('Delete avatar failed', err);
    }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!profile) return null;

  const resolvedAvatar =
    profile.avatar && typeof profile.avatar === 'object'
      ? profile.avatar.url
      : profile.avatar;

  const avatarSrc = resolvedAvatar
    ? resolvedAvatar.startsWith('/uploads')
      ? `${backendUrl}${resolvedAvatar}`
      : normalizeDriveUrl(resolvedAvatar)
    : null;

  return (
    <div className="page">
      <div className="profile-hero">
        <div className="avatar-wrapper">
          {avatarSrc ? (
            <img src={avatarSrc} alt={profile.displayName || profile.username} className="avatar" />
          ) : (
            <div className="avatar-placeholder">
              {(profile.displayName || profile.username)[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <div className="profile-info">
          <h2>{profile.displayName || profile.username}</h2>
          <p>{profile.email}</p>
          <span className="profile-stat">Age: {profile.age}</span>
          <span className="profile-stat">Posts: {profile.posts?.length || 0}</span>
        </div>
      </div>

      <div className="profile-actions">
        <Link to="/create-post" className="btn btn-primary">
          + Create Post
        </Link>
        <Link to="/your-post" className="btn btn-ghost">
          ☰ Your Posts
        </Link>
        <Link to="/profile/edit" className="btn btn-ghost btn-sm">
          Edit Profile
        </Link>
        {avatarSrc && (
          <button onClick={handleDeleteAvatar} className="btn btn-outline btn-sm">
            Delete Avatar
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
