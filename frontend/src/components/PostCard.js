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

  const getAvatarSrc = (avatar) => {
    if (!avatar) return null;
    const url = typeof avatar === 'object' ? avatar.url : avatar;
    return url.startsWith('/uploads') ? `${backendUrl}${url}` : normalizeDriveUrl(url);
  };

  const avatarSrc = getAvatarSrc(post.author?.avatar);
  const initials = post.author?.username?.[0]?.toUpperCase() || '?';

  const imageSrc = post.image
    ? typeof post.image === 'string'
      ? post.image.startsWith('/uploads')
        ? `${backendUrl}${post.image}`
        : normalizeDriveUrl(post.image)
      : normalizeDriveUrl(post.image.url || '')
    : '';

  return (
    <div className="post-card">
      {imageSrc && (
        <img
          src={imageSrc}
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
