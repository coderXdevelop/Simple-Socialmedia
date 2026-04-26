import React from 'react';
import { useAuth } from '../context/AuthContext';
import { likePost, unlikePost } from '../services/api';

const PostCard = ({ post, onUpdate, showActions = false, onEdit, onDelete }) => {
  const { user } = useAuth();
  const isLiked = post.likes?.some((l) => (l._id || l) === user?._id);
  const backendUrl = 'http://localhost:5000';

  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlikePost(post._id);
      } else {
        await likePost(post._id);
      }
      onUpdate && onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const getAvatarSrc = (avatar) =>
    avatar ? (avatar.startsWith('/uploads') ? `${backendUrl}${avatar}` : avatar) : null;

  const avatarSrc = getAvatarSrc(post.author?.avatar);
  const initials = post.author?.username?.[0]?.toUpperCase() || '?';

  return (
    <div className="post-card">
      {post.image && (
        <img
          src={`${backendUrl}${post.image}`}
          alt={post.title}
          className="post-image"
        />
      )}
      <div className="post-body">
        <div className="post-author">
          {avatarSrc ? (
            <img src={avatarSrc} alt={post.author?.username} className="post-author-avatar" />
          ) : (
            <div className="post-author-placeholder">{initials}</div>
          )}
          <div>
            <div className="post-author-name">@{post.author?.username}</div>
            <div className="post-time">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
              })}
            </div>
          </div>
        </div>

        <h3 className="post-title">{post.title}</h3>
        <p className="post-content">{post.content}</p>

        <div className="post-actions">
          <button
            className={`like-btn ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            {isLiked ? '♥' : '♡'} {post.likes?.length || 0} likes
          </button>

          {showActions && post.author?._id === user?._id && (
            <div className="post-manage-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => onEdit(post._id)}>
                ✎ Edit
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => onDelete(post._id)}>
                ✕ Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
