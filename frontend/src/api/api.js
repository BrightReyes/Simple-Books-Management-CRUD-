import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  console.log(`[API Request] -> ${config.method.toUpperCase()} ${config.url}`);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(`[API Request] Token attached to headers`);
  } else {
    console.log(`[API Request] No token found in localStorage`);
  }
  return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] <- ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`[API Error] <- ${error.response?.status} from ${error.config?.url}`, error.response?.data);
    if (error.response?.status === 401) {
      console.warn('[API Interceptor] 401 Unauthorized detected. Clearing session and redirecting to login.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ---- Auth ----
export const login = (username, password) =>
  api.post('/auth/login', { username, password });
export const signup = (username, password) =>
  api.post('/auth/signup', { username, password });

// ---- Users ----
export const getStudents = () => api.get('/users/students');
export const getProfile = () => api.get('/users/profile');

// ---- Books ----
export const getBooks = () => api.get('/books');
export const getAllBooks = () => api.get('/books/all');
export const getBookById = (id) => api.get(`/books/${id}`);
export const createBook = (formData) =>
  api.post('/books', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const updateBook = (id, data) => api.patch(`/books/${id}`, data);
export const deleteBook = (id) => api.delete(`/books/${id}`);

// ---- Assignments ----
export const assignBook = (studentId, bookId) =>
  api.post('/assignments', { studentId, bookId });
export const getMyAssignedBooks = () => api.get('/assignments/my-books');
export const getAssignments = () => api.get('/assignments');
export const deleteAssignment = (studentId, bookId) => 
  api.delete(`/assignments/${studentId}/${bookId}`);

export default api;
