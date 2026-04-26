import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserPosts, editPost } from '../services/api';

const EditPost = () => {
  const { id } = useParams();
  const [form, setForm] = useState({ title: '', content: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();
  const backendUrl = 'http://localhost:5000';

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await getUserPosts();
        const post = data.find((p) => p._id === id);
        if (!post) return navigate('/your-post');
        setForm({ title: post.title, content: post.content });
        setExistingImage(post.image || '');
      } catch {
        navigate('/your-post');
      } finally {
        setFetching(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

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
      await editPost(id, formData);
      navigate('/your-post');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="loading"><div className="spinner" /></div>;

  const currentImage = preview || (existingImage ? `${backendUrl}${existingImage}` : null);

  return (
    <div className="page-narrow" style={{ paddingTop: '3rem' }}>
      <div className="card">
        <h2 style={{ marginBottom: '0.25rem' }}>Edit Post</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
          Update your post
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              className="form-input"
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
              value={form.content}
              onChange={handleChange}
              required
              maxLength={2000}
              rows={5}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Image</label>
            {currentImage && (
              <img
                src={currentImage}
                alt="Preview"
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.75rem' }}
              />
            )}
            <label className="file-input-label">
              <span style={{ fontSize: '1.5rem' }}>🖼</span>
              <span>{file ? file.name : 'Replace image (optional)'}</span>
              <input type="file" accept="image/*" onChange={handleFile} />
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => navigate('/your-post')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
