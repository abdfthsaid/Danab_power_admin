import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [
    { id: 1, name: 'Ahmed Ali', email: 'ahmed@gmail.com', password: 'ahmed123', role: 'Admin', permissions: ['manage_stations', 'view_reports', 'edit_users', 'delete_users'] },
    { id: 2, name: 'abdifitaax', email: 'abdi@gmail.com', password: 'abdi123', role: 'User', permissions: ['view_reports'] },
    { id: 3, name: 'Khalid mohomud', email: 'khalid@gmail.com', password: 'khalid123', role: 'User', permissions: ['manage_stations', 'view_reports'] },
  ],
  permissions: [
    { key: 'manage_stations', label: 'Manage Stations' },
    { key: 'view_reports', label: 'View Reports' },
    { key: 'edit_users', label: 'Edit Users' },
    { key: 'delete_users', label: 'Delete Users' },
  ],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Add reducers for user management if needed
  },
});

export const selectUsers = (state) => state.users.users;
export const selectPermissions = (state) => state.users.permissions;

export default usersSlice.reducer; 