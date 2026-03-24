import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
// ✅ ALWAYS get fresh token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // 🔥 moved here

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;

export const signupUser = async (data) => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const getUser = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const fetchExpenses = async () => {
  const response = await api.get("/expenses");
  return response.data;
};

export const createExpense = async (data) => {
  const response = await api.post("/expenses", data);
  return response.data;
};

export const updateExpense = async (data) => {
  const response = await api.put(`/expenses`, data);
  return response.data;
};

// export const loginUser = async (data) => {
//   const response = await fetch(`${BASE_URL}/auth/login`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   return response.json();
// };

// export const getUser = async () => {
//

//   const response = await fetch(`${BASE_URL}/auth/profile`, {
//     method: "GET",
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return response.json();
// };
