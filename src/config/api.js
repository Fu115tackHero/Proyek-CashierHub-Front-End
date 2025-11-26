// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://proyek-cashier-hub-backend.vercel.app";

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/login`,
  USERS: `${API_BASE_URL}/api/users`,
  PRODUCTS: `${API_BASE_URL}/api/products`,
  TRANSACTIONS: `${API_BASE_URL}/api/transactions`,
};

export default API_BASE_URL;
