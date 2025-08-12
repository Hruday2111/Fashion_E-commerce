// API Configuration
const API_BASE = process.env.NODE_ENV === 'production'
  ? "https://my-backend.onrender.com"
  : "http://localhost:4000";

export default API_BASE;
