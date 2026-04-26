import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateAvatar } from '../services/api';
import { useAuth } from '../context/AuthContext';

const UploadAvatar = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select an image');
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const { data } = await updateAvatar(formData);
      setUser((prev) => ({ ...prev, avatar: data.avatar }));
      setSuccess('Avatar updated!');
      setTimeout(() => navigate('/profile'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-narrow" style={{ paddingTop: '4rem' }}>
      <div className="card">
        <h2 style={{ marginBottom: '0.25rem' }}>Upload Avatar</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
          Choose a profile photo (max 5MB)
        </p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {preview && <img src={preview} alt="Preview" className="upload-preview" />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="file-input-label">
              <span style={{ fontSize: '2rem' }}>📷</span>
              <span>{file ? file.name : 'Click to choose image'}</span>
              <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>JPEG, PNG, GIF, WebP</span>
              <input type="file" accept="image/*" onChange={handleFile} />
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ flex: 1 }}
              onClick={() => navigate('/profile')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={loading || !file}
            >
              {loading ? 'Uploading…' : 'Save Avatar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadAvatar;
