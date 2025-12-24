import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../api/apiConfig";

// Async thunk to fetch users from the API
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await apiService.getUsers();
  return response.data;
});

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "users/loginUser",
  async ({ username, password }) => {
    const response = await apiService.loginUser({ username, password });
    return {
      user: response.data.user,
      token: response.data.token,
      expiresAt: response.data.expiresAt,
    };
  }
);

// Register user thunk
export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiService.addUser(userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update user thunk (by username)
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ username, updateData }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateUser(username, updateData);
      return { username, user: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  users: [],
  permissions: [
    { key: "manage_stations", label: "Manage Stations" },
    { key: "view_reports", label: "View Reports" },
    { key: "edit_users", label: "Edit Users" },
    { key: "delete_users", label: "Delete Users" },
  ],
  loading: false,
  error: null,
  currentUser: JSON.parse(localStorage.getItem("sessionUser")) || null,
  authToken: localStorage.getItem("authToken") || null,
  tokenExpiresAt: localStorage.getItem("tokenExpiresAt") || null,
  loginLoading: false,
  loginError: null,
  loginSuccess: false,
  registerLoading: false,
  registerError: null,
  updateLoading: false,
  updateError: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    logoutUser(state) {
      state.currentUser = null;
      state.authToken = null;
      state.tokenExpiresAt = null;
      localStorage.removeItem("sessionUser");
      localStorage.removeItem("authToken");
      localStorage.removeItem("tokenExpiresAt");
    },
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
      localStorage.setItem("sessionUser", JSON.stringify(action.payload));
    },
    resetLoginState(state) {
      state.loginSuccess = false;
      state.loginError = null;
      state.loginLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
        state.loginSuccess = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.currentUser = action.payload.user;
        state.authToken = action.payload.token;
        state.tokenExpiresAt = action.payload.expiresAt;
        state.loginSuccess = true;
        localStorage.setItem(
          "sessionUser",
          JSON.stringify(action.payload.user)
        );
        if (action.payload.token) {
          localStorage.setItem("authToken", action.payload.token);
        }
        if (action.payload.expiresAt) {
          localStorage.setItem(
            "tokenExpiresAt",
            action.payload.expiresAt.toString()
          );
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false;
        state.loginError = action.error.message;
        state.loginSuccess = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.registerLoading = true;
        state.registerError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerLoading = false;
        // Optionally, add the new user to the users list
        if (action.payload && action.payload.id) {
          state.users.push(action.payload);
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerLoading = false;
        state.registerError = action.payload || action.error.message;
      })
      .addCase(updateUser.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateLoading = false;
        // Update the user in the users list
        const idx = state.users.findIndex(
          (u) => u.username === action.payload.username
        );
        if (idx !== -1) {
          state.users[idx] = { ...state.users[idx], ...action.payload.user };
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload || action.error.message;
      });
  },
});

export const selectUsers = (state) => state.users.users;
export const selectPermissions = (state) => state.users.permissions;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;
export const selectCurrentUser = (state) => state.users.currentUser;
export const selectLoginLoading = (state) => state.users.loginLoading;
export const selectLoginError = (state) => state.users.loginError;
export const selectLoginSuccess = (state) => state.users.loginSuccess;
export const selectRegisterLoading = (state) => state.users.registerLoading;
export const selectRegisterError = (state) => state.users.registerError;
export const selectUpdateLoading = (state) => state.users.updateLoading;
export const selectUpdateError = (state) => state.users.updateError;
export const selectAuthToken = (state) => state.users.authToken;
export const selectTokenExpiresAt = (state) => state.users.tokenExpiresAt;

export const { logoutUser, setCurrentUser, resetLoginState } =
  usersSlice.actions;

export default usersSlice.reducer;
