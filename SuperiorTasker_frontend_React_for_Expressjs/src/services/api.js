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
export const login = (loginData) => api.post('/api/login', loginData);
export const register = (userData) => api.post('/api/register', userData);
export const deleteUser = (id) => api.delete(`/user/delete/${id}`);
export const getUserById = (id) => api.get(`/user/findById/${id}`);
export const getUserByEmail = (email) => api.get(`/user/findByEmail/${email}`);
export const updateUser = (id, userData) => api.put(`/user/updateUser/${id}`, userData);

// Project requests
export const saveProject = (projectData) => api.post('/projects/saveProject', projectData);
export const deleteProject = (id) => api.delete(`/projects/deleteProject/${id}`);
export const getProjectById = (id) => api.get(`/projects/getProjectById/${id}`);
export const findAllProjects = (userId) => api.get(`/projects/findAllProjects/${userId}`);
export const updateProject = (id, updateProject) => api.put(`/projects/updateProject/${id}`, updateProject);

// Task requests
export const saveTask = (taskData) => api.post('/tasks/saveTask', taskData);
export const deleteTask = (id) => api.delete(`/tasks/delete/${id}`);
export const findTaskById = (id) => api.get(`/tasks/findTaskById/${id}`);
export const findAllTasksOfTheProject = (projectId) => api.get(`/tasks/findAllTasksOfProject/${projectId}`);
export const findAllTasksOfUser = (userId) => api.get(`/tasks/findAllTasksOfUser/${userId}`);
export const updateTask = (id, updatedTask) => api.put(`/tasks/updateTask/${id}`, updatedTask);

export default api;