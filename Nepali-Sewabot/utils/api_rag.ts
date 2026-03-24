

import axios from "axios";
import { getBaseUrl } from "./apiBaseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = getBaseUrl();

const api = axios.create({ 
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);
// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("user");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Authentication APIs
export const authAPI = {
  
  signup: (userData) => 
    api.post("/auth/signup/", userData),
  login: (credentials) => api.post("/auth/login/", credentials),
  logout: () => api.post("/auth/logout/"),
};

// Conversation APIs
export const conversationAPI = {
  list: () => api.get("/conversations/"),
  create: (data) => api.post("/conversations/", data),
  get: (id) => api.get(`/conversations/${id}/`),
  update: (id, data) => api.put(`/conversations/${id}/`, data),
  delete: (id) => api.delete(`/conversations/${id}/`),
  addMessage: (id, content, useRag = true) =>
    api.post(`/conversations/${id}/add_message/`, { content, use_rag: useRag }),
};

// Document APIs
export const documentAPI = {
  list: () => api.get("/documents/"),
  upload: (file, conversationId = null) => {
    const formData = new FormData();
    formData.append("file", file);
    if (conversationId) {
      formData.append("conversation_id", conversationId);
    }

    return api.post("/documents/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  get: (id) => api.get(`/documents/${id}/`),
  delete: (id) => api.delete(`/documents/${id}/`),
};

// Message APIs
export const messageAPI = {
  delete: (id) => api.delete(`/messages/${id}/`),
  update: (id, content) => api.put(`/messages/${id}/`, { content }),
};

export default api;
