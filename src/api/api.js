import axios from "axios";

const API = axios.create({
  baseURL: "https://prime-backend-i91j.onrender.com/api",
});
// const API = axios.create({
//   baseURL: "http://localhost:8081/api",
// });
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- Admin Auth ---
// Login admin — returns sessionId
export const loginAdmin = (email, password) =>
  API.post("/admin/login", { email, password });

// Verify OTP — returns JWT token
export const verifyOtp = (data) => API.post("/admin/verify-otp", data);
// --- Marbles ---
export const getAllMarbles = () => API.get("/marbles/admin");

export const createMarble = (formData) => API.post("/marbles", formData);

export const updateMarble = (id, formData) =>
  API.put(`/marbles/${id}`, formData);

export const deleteMarble = (id) => API.delete(`/marbles/${id}`);

// --- Public (if needed) ---
export const getPublicMarbles = () => API.get("/marbles");

export const getCompletedProjects = () => API.get("/projects");
export const createCompletedProject = (formData) =>
  API.post("/projects", formData);
export const deleteCompletedProject = (id) => API.delete(`/projects/${id}`);
// Kitchen Projects
export const getKitchenProjects = () => API.get("/kitchen-projects");
export const createKitchenProject = (formData) =>
  API.post("/kitchen-projects", formData);
export const deleteKitchenProject = (id) =>
  API.delete(`/kitchen-projects/${id}`);

export const getCategoriesProjects = () => API.get("/categories");
export const createCategoriesProject = (formData) =>
  API.post("/categories", formData);
export const deleteCategoriesProject = (id) => API.delete(`/categories/${id}`);

//Dashboard Summary
export const getDashboardSummary = async () => {
  const [marbles, completed, kitchen] = await Promise.all([
    API.get("/marbles/admin"),
    API.get("/projects"),
    API.get("/kitchen-projects"),
  ]);

  return {
    marbleCount: marbles.data.length,
    completedCount: completed.data.length,
    kitchenCount: kitchen.data.length,
  };
};
