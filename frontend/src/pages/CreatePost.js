import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/api';

const CreatePost = () => {
  const [form, setForm] = useState({ title: '', content: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('content', form.content);
      if (file) formData.append('image', file);
      await createPost(formData);
      navigate('/your-post');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-narrow" style={{ paddingTop: '3rem' }}>
      <div className="card">
        <h2 style={{ marginBottom: '0.25rem' }}>Create Post</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
          Share something with the world
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="Give it a headline"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea
              name="content"
              className="form-textarea"
              placeholder="What's on your mind?"
              value={form.content}
              onChange={handleChange}
              required
              maxLength={2000}
              rows={5}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Image (optional)</label>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.75rem' }}
              />
            )}
            <label className="file-input-label">
              <span style={{ fontSize: '1.5rem' }}>🖼</span>
              <span>{file ? file.name : 'Attach an image'}</span>
              <input type="file" accept="image/*" onChange={handleFile} />
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => navigate('/profile')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? 'Publishing…' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
