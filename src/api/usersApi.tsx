// import axios from 'axios';
// import { User } from '../types';

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api/users',
// });

// // ... (Interceptor remains the same) ...
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('userToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // --- API Functions ---

// export const fetchUsers = async (): Promise<User[]> => {
//   const response = await api.get('/');
//   return response.data;
// };

// export const deleteUserApi = async (id: string): Promise<void> => {
//   await api.delete(`/${id}`);
// };

// export const addUserApi = async (userData: Omit<User, '_id'>): Promise<User> => {
//   const response = await api.post('/', userData);
//   return response.data;
// };

// // FIX: Change the return type to Promise<User> and return the response data
// export const updateUserApi = async (id: string, updates: Partial<User>): Promise<User> => {
//   const response = await api.put(`/${id}`, updates);
//   return response.data; // Return the full updated user object from the backend
// };

// C:\Users\Surya.Singh\OneDrive - Parkar\Desktop\team_project1\project_mgmt\frontend\src\api\usersApi.tsx

import axios from 'axios';
import { User } from '../types'; // Assuming this file exists as you stated

const api = axios.create({
  baseURL: 'http://localhost:5000/api/users',
});

// ... (Interceptor remains the same) ...
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Define the response type for the paginated data returned by the backend
interface PaginatedResponse {
    data: User[];
    currentPage: number;
    totalPages: number;
    totalUsers: number;
}


// --- API Functions ---

// Modify fetchUsers to accept page, limit, and search parameters
export const fetchUsers = async (page: number = 1, limit: number = 10, search: string = ''): Promise<PaginatedResponse> => {
  const response = await api.get('/', {
      params: { page, limit, search }
  });
  return response.data; // This now returns the full PaginatedResponse object
};

export const deleteUserApi = async (id: string): Promise<void> => {
  await api.delete(`/${id}`);
};

export const addUserApi = async (userData: Omit<User, '_id'>): Promise<User> => {
  const response = await api.post('/', userData);
  return response.data;
};

export const updateUserApi = async (id: string, updates: Partial<User>): Promise<User> => {
  const response = await api.put(`/${id}`, updates);
  return response.data;
};

