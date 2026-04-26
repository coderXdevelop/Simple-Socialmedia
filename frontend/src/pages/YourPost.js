import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserPosts, deletePost } from '../services/api';
import PostCard from '../components/PostCard';

const YourPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const { data } = await getUserPosts();
      setPosts(data);
    } catch {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert('Failed to delete post');
    }
  };

  const handleEdit = (id) => navigate(`/edit-post/${id}`);

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Your <span>Posts</span></h1>
        <Link to="/create-post" className="btn btn-primary">+ New Post</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✍️</div>
          <h3>No posts yet</h3>
          <p>Share your first story with the world</p>
          <Link to="/create-post" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              showActions={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onUpdate={fetchPosts}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default YourPost;
