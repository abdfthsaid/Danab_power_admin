// Role-based access control utilities

/**
 * Check if the current user is an admin
 * @param {Object} user - The user object from auth context
 * @returns {boolean} - True if user is admin, false otherwise
 */
export const isAdmin = (user) => {
  if (!user) return false;
  
  // Check multiple possible admin indicators
  return (
    user.role === 'admin' || 
    user.isAdmin === true || 
    user.username === 'admin' ||
    user.userType === 'admin'
  );
};

/**
 * Check if the current user has a specific role
 * @param {Object} user - The user object from auth context
 * @param {string} role - The role to check for
 * @returns {boolean} - True if user has the role, false otherwise
 */
export const hasRole = (user, role) => {
  if (!user) return false;
  
  return user.role === role || user.userType === role;
};

/**
 * Check if the current user has a specific permission
 * @param {Object} user - The user object from auth context
 * @param {string} permission - The permission to check for
 * @returns {boolean} - True if user has the permission, false otherwise
 */
export const hasPermission = (user, permission) => {
  if (!user) return false;
  
  // If user is admin, they have all permissions
  if (isAdmin(user)) return true;
  
  // Check user's permissions array if it exists
  if (user.permissions && Array.isArray(user.permissions)) {
    return user.permissions.includes(permission);
  }
  
  return false;
};

/**
 * Get user's display role
 * @param {Object} user - The user object from auth context
 * @returns {string} - The display role (Admin, User, etc.)
 */
export const getUserDisplayRole = (user) => {
  if (!user) return 'Guest';
  
  if (isAdmin(user)) return 'Admin';
  
  return user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User';
};

/**
 * Get role-based navigation items
 * @param {Object} user - The user object from auth context
 * @param {Array} allItems - All possible navigation items
 * @returns {Array} - Filtered navigation items based on user role
 */
export const getRoleBasedNavigation = (user, allItems) => {
  if (!user) return [];
  
  if (isAdmin(user)) {
    return allItems; // Admin sees everything
  }
  
  // Filter items based on user role
  return allItems.filter(item => {
    // If item has no role restriction, show it
    if (!item.roles && !item.adminOnly) return true;
    
    // If item is admin only, don't show to regular users
    if (item.adminOnly) return false;
    
    // If item has specific roles, check if user has one of them
    if (item.roles && Array.isArray(item.roles)) {
      return item.roles.includes(user.role);
    }
    
    return true;
  });
}; 