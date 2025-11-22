// import axios from 'axios'

// export const API = axios.create({
//   baseURL: 'http://localhost:5000/api'
// })

// API.interceptors.request.use((config) => {
//   const t = localStorage.getItem('token')
//   if (t) config.headers.Authorization = `Bearer ${t}`
//   return config
// })

// import axios from 'axios';

// export const API = axios.create({
//   baseURL: 'http://localhost:5000/api',
// });

// // selipkan token setiap request
// API.interceptors.request.use((config) => {
//   const t = localStorage.getItem('token');
//   if (t) config.headers.Authorization = `Bearer ${t}`;
//   return config;
// });

// // (opsional) auto-logout saat 401
// API.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err?.response?.status === 401) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       // window.location.href = '/login'; // aktifkan kalau mau langsung redirect
//     }
//     return Promise.reject(err);
//   }
// );

import axios from 'axios';

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use((config) => {
  const t = localStorage.getItem('token');
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(err);
  }
);
