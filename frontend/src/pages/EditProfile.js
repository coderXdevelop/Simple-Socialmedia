import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile, updateAvatar, deleteAvatar } from '../services/api';

const EditProfile = () => {
  const { setUser } = useAuth();
  const [form, setForm] = useState({ displayName: '', age: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await getProfile();
        setForm({
          displayName: data.displayName || data.username || '',
          age: data.age || '',
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUploadAvatar = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select an image to upload');
    setError('');
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const { data } = await updateAvatar(formData);
      setUser((prev) => (prev ? { ...prev, avatar: data.avatar } : prev));
      setPreview(null);
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAvatarLocal = async () => {
    try {
      await deleteAvatar();
      setUser((prev) => (prev ? { ...prev, avatar: '' } : prev));
    } catch (err) {
      console.error('Delete avatar failed', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const { data } = await updateProfile(form);
      setUser((prev) => ({ ...prev, displayName: form.displayName, age: Number(form.age) }));
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="auth-card card">
        <h1 className="auth-title">Update Profile</h1>
        <p className="auth-subtitle">Change your display name and age.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input
              type="text"
              name="displayName"
              value={form.displayName}
              onChange={handleChange}
              className="form-input"
              required
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Age</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              className="form-input"
              required
              min={1}
              max={120}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>

        <hr style={{ margin: '1.5rem 0' }} />

        <h3 style={{ marginBottom: '0.5rem' }}>Avatar</h3>
        {error && <div className="alert alert-error">{error}</div>}
        {preview && <img src={preview} alt="Preview" className="upload-preview" />}

        <form onSubmit={handleUploadAvatar} style={{ marginTop: '1rem' }}>
          <div className="form-group">
            <label className="file-input-label">
              <span style={{ fontSize: '1.5rem' }}>📷</span>
              <span>{file ? file.name : 'Choose an image'}</span>
              <input type="file" accept="image/*" onChange={handleFile} />
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-ghost" onClick={() => { setFile(null); setPreview(null); }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving || !file}>
              {saving ? 'Uploading…' : 'Upload Avatar'}
            </button>
            <button type="button" className="btn btn-outline" onClick={handleDeleteAvatarLocal}>
              Delete Avatar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
