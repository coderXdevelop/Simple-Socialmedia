import React, { useEffect, useState } from 'react';
import { getAllPosts } from '../services/api';
import PostCard from '../components/PostCard';

const ViewPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      const { data } = await getAllPosts();
      setPosts(data);
    } catch {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Explore <span>Feed</span></h1>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🌌</div>
          <h3>Nothing here yet</h3>
          <p>Be the first to post something</p>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onUpdate={fetchPosts}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewPost;
