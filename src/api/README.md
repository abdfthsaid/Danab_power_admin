# API Configuration

This directory contains the centralized API configuration for the admin dashboard.

## Files

- `apiConfig.js` - Main API configuration file with all endpoints and service functions

## Usage

### Import the API service

```javascript
import { apiService } from '../api/apiConfig';
```

### Available API Methods

#### Users
- `apiService.getUsers()` - Get all users
- `apiService.loginUser(credentials)` - Login user
- `apiService.addUser(userData)` - Add new user
- `apiService.updateUser(username, userData)` - Update user
- `apiService.deleteUser(id)` - Delete user

#### Stations
- `apiService.getStations()` - Get all stations
- `apiService.addStation(stationData)` - Add new station
- `apiService.updateStation(id, stationData)` - Update station
- `apiService.deleteStation(imei)` - Delete station
- `apiService.getStationStats(imei)` - Get station statistics

#### Revenue
- `apiService.getDailyRevenue(imei)` - Get daily revenue for station
- `apiService.getMonthlyRevenue(imei)` - Get monthly revenue for station

#### Customers
- `apiService.getDailyCustomers(imei)` - Get daily customers for station
- `apiService.getMonthlyCustomers(imei)` - Get monthly customers for station

#### Charts
- `apiService.getChartsByImei(imei)` - Get charts data for specific station
- `apiService.getAllCharts()` - Get all charts data

#### Transactions
- `apiService.getLatestTransactions()` - Get latest transactions

### Example Usage

```javascript
// Get all stations
const response = await apiService.getStations();
const stations = response.data.stations;

// Add a new user
const newUser = {
  username: 'john_doe',
  password: 'password123',
  email: 'john@example.com',
  role: 'user',
  permissions: ['view_reports']
};

const response = await apiService.addUser(newUser);
```

### Error Handling

All API methods return promises that can be handled with try-catch:

```javascript
try {
  const response = await apiService.getStations();
  // Handle success
} catch (error) {
  // Handle error
  console.error('API Error:', error.response?.data?.message || error.message);
}
```

### Configuration

The API base URL is configured in `apiConfig.js`:

```javascript
const API_BASE_URL = 'https://phase2backeend-ptsd.onrender.com';
```

To change the API endpoint, simply update this constant.

### Authentication

The API client automatically includes authentication tokens from localStorage if available:

```javascript
// Token is automatically added to requests
const token = localStorage.getItem('authToken');
```

## Benefits

1. **Centralized Configuration** - All API endpoints in one place
2. **Easy Maintenance** - Change API URL once, affects all requests
3. **Consistent Error Handling** - Standardized error responses
4. **Type Safety** - Clear method signatures and return types
5. **Authentication** - Automatic token inclusion
6. **Interceptors** - Request/response logging and error handling 