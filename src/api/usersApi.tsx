// // import axios from 'axios';
// // import { User } from '../types';

// // const api = axios.create({
// //   baseURL: 'http://localhost:5000/api/users',
// // });

// // api.interceptors.request.use((config) => {
// //     const token = localStorage.getItem('userToken');
// //     if (token) {
// //         config.headers.Authorization = `Bearer ${token}`;
// //     }
// //     return config;
// // }, (error) => {
// //     return Promise.reject(error);
// // });

// // export const fetchUsers = async (): Promise<User[]> => {
// //   const response = await api.get('/');
// //   return response.data;
// // };

// // export const deleteUserApi = async (id: string): Promise<void> => {
// //   await api.delete(`/${id}`);
// // };

// // export const addUserApi = async (userData: Omit<User, '_id'>): Promise<User> => {
// //   const response = await api.post('/', userData);
// //   return response.data;
// // };

// // export const updateUserApi = async (id: string, updates: Partial<User>): Promise<User> => {
// //   const response = await api.put(`/${id}`, updates);
// //   return response.data;
// // };
// import axios from 'axios';
// import { User } from '../types';

// // Create a new Axios instance specifically for user-related requests
// const api = axios.create({
//   baseURL: 'http://localhost:5000/api/users',
// });

// // Add a request interceptor to attach the Authorization header to every outgoing request
// api.interceptors.request.use(
//   (config) => {
//     // Retrieve the token from local storage
//     const token = localStorage.getItem('userToken');

//     // If a token exists, add it to the request headers
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // Return the updated configuration
//     return config;
//   },
//   (error) => {
//     // Handle request errors
//     return Promise.reject(error);
//   }
// );

// // --- API Functions (remain largely the same, but now use the configured 'api' instance) ---

// export const fetchUsers = async (): Promise<User[]> => {
//   // This request now automatically includes the Authorization header
//   const response = await api.get('/');
//   return response.data;
// };

// export const deleteUserApi = async (id: string): Promise<void> => {
//   // This request now automatically includes the Authorization header
//   await api.delete(`/${id}`);
// };

// export const addUserApi = async (userData: Omit<User, '_id'>): Promise<User> => {
//   // This request now automatically includes the Authorization header
//   const response = await api.post('/', userData);
//   return response.data;
// };

// export const updateUserApi = async (id: string, updates: Partial<User>): Promise<User> => {
//   // This request now automatically includes the Authorization header
//   const response = await api.put(`/${id}`, updates);
//   return response.data;
// };
// src/api/usersApi.tsx

import axios from 'axios';
import { User } from '../types';

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

// --- API Functions ---

export const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get('/');
  return response.data;
};

export const deleteUserApi = async (id: string): Promise<void> => {
  await api.delete(`/${id}`);
};

export const addUserApi = async (userData: Omit<User, '_id'>): Promise<User> => {
  const response = await api.post('/', userData);
  return response.data;
};

// FIX: Change the return type to Promise<User> and return the response data
export const updateUserApi = async (id: string, updates: Partial<User>): Promise<User> => {
  const response = await api.put(`/${id}`, updates);
  return response.data; // Return the full updated user object from the backend
};
