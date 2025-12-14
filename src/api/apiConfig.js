// API Configuration
const API_BASE_URL = "https://phase2backeend-ptsd.onrender.com";

// API endpoints
export const API_ENDPOINTS = {
  // Users
  USERS: {
    ALL: "/api/users/all",
    LOGIN: "/api/users/login",
    ADD: "/api/users/add",
    UPDATE: "/api/users/update",
    DELETE: "/api/users/delete",
  },

  // Stations
  STATIONS: {
    BASIC: "/api/stations/basic",
    ADD: "/api/stations/add",
    UPDATE: "/api/stations/update",
    DELETE: "/api/stations/delete",
    STATS: "/api/stations/stats",
  },

  // Revenue
  REVENUE: {
    DAILY: "/api/revenue/daily",
    MONTHLY: "/api/revenue/monthly",
  },

  // Customers
  CUSTOMERS: {
    DAILY_BY_IMEI: "/api/customers/daily-by-imei",
    MONTHLY: "/api/customers/monthly",
    DAILY_TOTAL: "/api/customers/daily-total",
    MONTHLY_TOTAL: "/api/customers/monthly-total",
  },

  // Charts
  CHARTS: {
    BY_IMEI: "/api/charts",
    ALL: "/api/chartsAll/all",
  },

  // Transactions
  TRANSACTIONS: {
    LATEST: "/api/transactions/latest",
  },

  // Blacklist
  BLACKLIST: {
    ALL: "/api/blacklist",
    ADD: "/api/blacklist",
    CHECK: "/api/blacklist/check",
    DELETE: "/api/blacklist",
  },
};

// Utility function to build full URL
export const buildApiUrl = (endpoint, params = {}) => {
  let url = `${API_BASE_URL}${endpoint}`;

  // Add query parameters if provided
  if (Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(params).toString();
    url += `?${queryString}`;
  }

  return url;
};

// Axios instance with default configuration
import axios from "axios";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth tokens if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Users
  getUsers: () => apiClient.get(API_ENDPOINTS.USERS.ALL),
  loginUser: (credentials) =>
    apiClient.post(API_ENDPOINTS.USERS.LOGIN, credentials),
  addUser: (userData) => apiClient.post(API_ENDPOINTS.USERS.ADD, userData),
  updateUser: (username, userData) =>
    apiClient.put(
      `${API_ENDPOINTS.USERS.UPDATE}?username=${encodeURIComponent(username)}`,
      userData
    ),
  deleteUser: (id) =>
    apiClient.delete(`${API_ENDPOINTS.USERS.DELETE}?id=${id}`),

  // Stations
  getStations: () => apiClient.get(API_ENDPOINTS.STATIONS.BASIC),
  addStation: (stationData) =>
    apiClient.post(API_ENDPOINTS.STATIONS.ADD, stationData),
  updateStation: (id, stationData) =>
    apiClient.put(`${API_ENDPOINTS.STATIONS.UPDATE}/${id}`, stationData),
  deleteStation: (imei) =>
    apiClient.delete(`${API_ENDPOINTS.STATIONS.DELETE}/${imei}`),
  getStationStats: (imei) =>
    apiClient.get(`${API_ENDPOINTS.STATIONS.STATS}/${imei}`),

  // Revenue
  getDailyRevenue: (imei) =>
    apiClient.get(`${API_ENDPOINTS.REVENUE.DAILY}/${imei}`),
  getMonthlyRevenue: (imei) =>
    apiClient.get(`${API_ENDPOINTS.REVENUE.MONTHLY}/${imei}`),
  getAllDailyRevenue: () => apiClient.get(API_ENDPOINTS.REVENUE.DAILY),
  getAllMonthlyRevenue: () => apiClient.get(API_ENDPOINTS.REVENUE.MONTHLY),

  // Customers
  getDailyCustomers: (imei) =>
    apiClient.get(`${API_ENDPOINTS.CUSTOMERS.DAILY_BY_IMEI}/${imei}`),
  getMonthlyCustomers: (imei) =>
    apiClient.get(`${API_ENDPOINTS.CUSTOMERS.MONTHLY}/${imei}`),
  getDailyTotalCustomers: () =>
    apiClient.get(API_ENDPOINTS.CUSTOMERS.DAILY_TOTAL),
  getMonthlyTotalCustomers: () =>
    apiClient.get(API_ENDPOINTS.CUSTOMERS.MONTHLY_TOTAL),

  // Charts
  getChartsByImei: (imei) =>
    apiClient.get(`${API_ENDPOINTS.CHARTS.BY_IMEI}/${imei}`),
  getAllCharts: () => apiClient.get(API_ENDPOINTS.CHARTS.ALL),

  // Transactions
  getLatestTransactions: () => apiClient.get(API_ENDPOINTS.TRANSACTIONS.LATEST),

  // Blacklist
  getBlacklist: () => apiClient.get(API_ENDPOINTS.BLACKLIST.ALL),
  addToBlacklist: (data) => apiClient.post(API_ENDPOINTS.BLACKLIST.ADD, data),
  checkBlacklist: (phoneNumber) =>
    apiClient.get(`${API_ENDPOINTS.BLACKLIST.CHECK}/${phoneNumber}`),
  removeFromBlacklist: (id) =>
    apiClient.delete(`${API_ENDPOINTS.BLACKLIST.DELETE}/${id}`),
};

export default apiService;
