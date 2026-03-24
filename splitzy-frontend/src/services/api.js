import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

//make common API axois instance for all API calls

const api = axios.create({
  baseURL: BASE_URL,
});

export const signupUser = async (data) => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const getUser = async () => {
  const token = localStorage.getItem("token");
  const response = await api.get("/auth/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchExpenses = async () => {
  const token = localStorage.getItem("token");
  const response = await api.get("/expenses", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createExpense = async (data) => {
  const token = localStorage.getItem("token");
  const response = await api.post("/expenses", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateExpense = async (data) => {
  const token = localStorage.getItem("token");
  const response = await api.put(`/expenses/${data.id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
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
//   const token = localStorage.getItem("token");

//   const response = await fetch(`${BASE_URL}/auth/profile`, {
//     method: "GET",
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return response.json();
// };
