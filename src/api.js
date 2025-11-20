// import axios from 'axios'

// export const API = axios.create({
//   baseURL: 'http://localhost:5000/api'
// })

// API.interceptors.request.use((config) => {
//   const t = localStorage.getItem('token')
//   if (t) config.headers.Authorization = `Bearer ${t}`
//   return config
// })

import axios from 'axios';

export const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// selipkan token setiap request
API.interceptors.request.use((config) => {
  const t = localStorage.getItem('token');
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

// (opsional) auto-logout saat 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // window.location.href = '/login'; // aktifkan kalau mau langsung redirect
    }
    return Promise.reject(err);
  }
);
