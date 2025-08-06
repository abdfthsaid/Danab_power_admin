# Role-Based Access Control (RBAC) System

This document explains the role-based access control system implemented in the Danab Power admin dashboard.

## Overview

The RBAC system controls what sections and features users can access based on their role. There are two main user types:

- **Admin Users**: Have full access to all features
- **Regular Users**: Have limited access to specific features

## User Roles

### Admin Users
Admin users can access all sections of the application:
- Dashboard
- Stations Management
- Slot Management
- Revenue Analytics
- User Management
- Notifications
- Settings

### Regular Users
Regular users have limited access:
- Dashboard
- Stations Management (view only)
- Slot Management (view only)
- Settings

## Implementation Details

### 1. Role Detection
The system detects admin users using multiple criteria:
```javascript
const isAdmin = (user) => {
  return (
    user.role === 'admin' || 
    user.isAdmin === true || 
    user.username === 'admin' ||
    user.userType === 'admin'
  );
};
```

### 2. Protected Routes
Routes are protected using the `ProtectedRoute` component:
```javascript
<Route path="revenue" element={
  <ProtectedRoute adminOnly={true}>
    <Revenue />
  </ProtectedRoute>
} />
```

### 3. Sidebar Navigation
The sidebar automatically shows/hides sections based on user role:
- Admin users see all sections
- Regular users see only allowed sections

### 4. Topbar Features
- User menu shows role information
- Notifications show different content based on role
- Role indicator displays current user type

## Files Modified

### Core Components
- `src/components/Sidebar.jsx` - Role-based navigation
- `src/components/Topbar.jsx` - Role-based UI elements
- `src/components/ProtectedRoute.jsx` - Route protection
- `src/App.jsx` - Protected route implementation

### Utilities
- `src/utils/roleUtils.js` - Role checking utilities

### Context
- `src/context/AuthContext.jsx` - User authentication and role data

## Usage Examples

### Checking User Role
```javascript
import { isAdmin, hasRole, getUserDisplayRole } from '../utils/roleUtils';

const userIsAdmin = isAdmin(user);
const hasSpecificRole = hasRole(user, 'manager');
const displayRole = getUserDisplayRole(user);
```

### Protecting Components
```javascript
import ProtectedRoute from '../components/ProtectedRoute';

<ProtectedRoute adminOnly={true}>
  <AdminOnlyComponent />
</ProtectedRoute>
```

### Conditional Rendering
```javascript
{isAdmin(user) && (
  <AdminOnlyFeature />
)}
```

## Customization

### Adding New Roles
1. Update the `isAdmin` function in `roleUtils.js`
2. Add role-specific logic to navigation items
3. Update protected routes as needed

### Adding New Protected Features
1. Wrap the component with `ProtectedRoute`
2. Add role checks in the component logic
3. Update navigation items if needed

### Modifying Access Levels
1. Update the `getNavigationItems` function in `Sidebar.jsx`
2. Modify route protection in `App.jsx`
3. Update component-level checks

## Security Notes

- Always verify permissions on both client and server side
- Never rely solely on client-side role checks
- Implement proper authentication and authorization on the backend
- Use HTTPS in production
- Regularly audit access controls

## Testing

To test the role-based access control:

1. **Admin User**: Login with admin credentials to see all features
2. **Regular User**: Login with regular user credentials to see limited features
3. **Direct URL Access**: Try accessing admin-only URLs with regular user account
4. **Navigation**: Verify that sidebar shows correct sections for each role

## Troubleshooting

### Common Issues

1. **User not recognized as admin**
   - Check user data structure in localStorage
   - Verify role field names match expected values
   - Check authentication context

2. **Protected routes not working**
   - Ensure `ProtectedRoute` component is properly imported
   - Verify route configuration in `App.jsx`
   - Check user authentication state

3. **Sidebar showing wrong sections**
   - Verify role detection logic
   - Check user data in Redux store
   - Ensure proper re-rendering on role changes

### Debug Tips

1. Check browser console for errors
2. Verify user data in Redux DevTools
3. Test with different user accounts
4. Check localStorage for user session data 