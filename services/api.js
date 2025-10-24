import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Constants from 'expo-constants';


const API_HOST = Constants.expoConfig?.extra?.API_HOST || "localhost";
//const API_BASE_URL = `http://10.95.124.171:3000/api`;
const API_BASE_URL = `http://${API_HOST}:3000/api`;

console.log("Current URL: ", API_BASE_URL)


const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("authToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, logout user
      await AsyncStorage.removeItem("authToken")
      await AsyncStorage.removeItem("userData")
    }
    return Promise.reject(error)
  },
)
// Auth API endpoints
export const authAPI = {
  login: (email, password, role) => api.post("/auth/login", { email, password ,role}),
  register: (userData) => api.post("/auth/register", userData),
  refreshToken: () => api.post("/auth/refresh"),
}
// Student API endpoints
export const commonAPI = {

  getProfile: () => api.get("/student/profile"),
  updateProfile: (data) => api.put("/student/profile", data),
  getDailyPasskey: () => api.get("/passkey/today"),
  changePassword: (currentPassword, newPassword) => api.put('/student/passwordUpdate', { currentPassword, newPassword }),
  getDailyPasskeyGuard: () => api.get("/passkey/todayGuard"),
}

export const outpass = {
  getOutpasses: () => api.get("/outpass/today"),
  createOutpass: (data) => api.post("/outpass/generate", data),
  updateOutpass: (id, data) => api.put(`/outpass/${id}`, data),
}

// Emergency API endpoints
export const emergencyAPI = {
  createAlert: (data) => api.post("/emergency/alert", data),
  getEmergencyContacts: () => api.get("/emergency/contacts"),
}

// Security API endpoints
export const securityAPI = {
  validatePasskey: (data) => api.post("/security/validate", data),
  logEntry: (data) => api.post("/security/log", data),
}

export default api
