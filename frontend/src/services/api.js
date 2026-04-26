import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const logout = () => API.get('/auth/logout');

// User
export const getProfile = () => API.get('/user/profile');
export const updateAvatar = (formData) =>
  API.put('/user/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

// Posts
export const createPost = (formData) =>
  API.post('/post/create', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getAllPosts = () => API.get('/post/all');
export const getUserPosts = () => API.get('/post/user');
export const editPost = (id, formData) =>
  API.put(`/post/edit/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deletePost = (id) => API.delete(`/post/delete/${id}`);
export const likePost = (id) => API.put(`/post/like/${id}`);
export const unlikePost = (id) => API.put(`/post/unlike/${id}`);
