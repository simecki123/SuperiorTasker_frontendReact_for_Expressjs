import axios from 'axios';

const API_URL = 'http://localhost:8080';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// On request from frontend we set token to header
api.interceptors.request.use(
  (config) => {
    console.log('Request interceptor called');
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor for responses from backend
api.interceptors.response.use(
  (response) => {
    console.log('Response interceptor called:', response);
    return response;
  },
  (error) => {
    console.log('Response interceptor error:', error);
    if (error.response?.status === 401) {
      // Unauthorized, redirect to login
      console.log('Unauthorized, redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
    } else if (error.response?.status === 403) {
      console.log('Forbidden, redirecting to login');
      
    }
    return Promise.reject(error);
  }
);

// User requests
export const login = (loginData) => api.post('/api/auth/login', loginData);
export const register = (userData) => api.post('/api/auth/register', userData);
export const getUserById = (id) => api.get(`/api/auth/user/getUserById/${id}`);
export const updateUser = (id, userData) => api.put(`/api/auth/user/update/${id}`, userData);

// Project requests
export const saveProject = (projectData) => api.post('/api/projects/saveProject', projectData);
export const deleteProject = (id) => api.delete(`/api/projects/deleteProject/${id}`);
export const getProjectById = (id) => api.get(`/api/projects/getProjectById/${id}`);
export const findAllProjects = (userId) => api.get(`/api/projects/findProjectsByUserId/${userId}`);
export const updateProject = (id, updateProject) => api.put(`/api/projects/updateProject/${id}`, updateProject);

// Task requests
export const saveTask = (taskData) => api.post('/api/tasks/saveTask', taskData);
export const deleteTask = (id) => api.delete(`/api/tasks/deleteTask/${id}`);
export const findTaskById = (id) => api.get(`/api/tasks/findTaskById/${id}`);
export const findAllTasksOfTheProject = (projectId) => api.get(`/api/tasks/findByProjectId/${projectId}`);
export const findAllTasksOfUser = (userId) => api.get(`/api/tasks/findByUserId/${userId}`);
export const updateTask = (id, updatedTask) => api.put(`/api/tasks/updateTask/${id}`, updatedTask);

// Admin requests
export const fetchAllUsers = (userId) => api.get(`/api/admin/getusers/${userId}`);
export const updateUserRole = (userId, newRole) => api.put(`/api/admin/user/${userId}/role`, {newRole});
export const deleteUser = (userId) => api.delete(`/api/admin/user/${userId}`);

export default api;