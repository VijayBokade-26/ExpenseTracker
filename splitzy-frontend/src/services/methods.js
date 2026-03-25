import api from "./api";

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
  const response = await api.put(`/expenses/${data.id}`, data);
  return response.data;
};

//delete expense
export const deleteExpense = async (ids) => {
  const response = await api.delete(`/expenses/bulk-delete`, { data: { ids } });
  return response.data;
};
