// Role-based permission system

export const ROLES = {
  USER: "user",
  MODERATOR: "moderator",
  ADMIN: "admin",
};

// Get user role from session
export const getUserRole = () => {
  const sessionUser = localStorage.getItem("sessionUser");
  if (!sessionUser) return null;

  try {
    const user = JSON.parse(sessionUser);
    return user.role || null;
  } catch (error) {
    console.error("Error parsing session user:", error);
    return null;
  }
};

// Check if user has a specific role
export const hasRole = (role) => {
  const userRole = getUserRole();
  return userRole === role;
};

// Check if user has at least a certain role level
export const hasMinRole = (minRole) => {
  const userRole = getUserRole();
  const roleHierarchy = {
    [ROLES.USER]: 1,
    [ROLES.MODERATOR]: 2,
    [ROLES.ADMIN]: 3,
  };

  return roleHierarchy[userRole] >= roleHierarchy[minRole];
};

// Permission checks for specific actions
export const permissions = {
  // Dashboard access
  canViewDashboard: () => hasMinRole(ROLES.MODERATOR),

  // Slots management
  canViewSlots: () => hasMinRole(ROLES.USER), // All users can view slots
  canManageSlots: () => hasRole(ROLES.ADMIN), // Only admin can manage

  // Stations
  canViewStations: () => hasMinRole(ROLES.MODERATOR),
  canAddStation: () => hasRole(ROLES.ADMIN),
  canUpdateStation: () => hasRole(ROLES.ADMIN),
  canDeleteStation: () => hasRole(ROLES.ADMIN),

  // Users - Admin only (hidden from moderators)
  canViewUsers: () => hasRole(ROLES.ADMIN),
  canAddUser: () => hasRole(ROLES.ADMIN),
  canUpdateUser: () => hasRole(ROLES.ADMIN),
  canDeleteUser: () => hasRole(ROLES.ADMIN),

  // Blacklist - All authenticated users can manage
  canViewBlacklist: () => hasMinRole(ROLES.USER),
  canAddToBlacklist: () => hasMinRole(ROLES.USER),
  canRemoveFromBlacklist: () => hasMinRole(ROLES.USER), // All users can delete

  // Revenue & Analytics
  canViewRevenue: () => hasMinRole(ROLES.MODERATOR),
  canViewCharts: () => hasMinRole(ROLES.MODERATOR),
  canViewTransactions: () => hasMinRole(ROLES.MODERATOR),

  // Notifications
  canViewNotifications: () => hasMinRole(ROLES.MODERATOR),

  // Settings
  canViewSettings: () => hasMinRole(ROLES.USER),
  canChangePassword: () => hasMinRole(ROLES.USER),
};

// Get allowed routes based on user role
export const getAllowedRoutes = () => {
  const userRole = getUserRole();

  const routes = {
    [ROLES.USER]: ["/slots", "/blacklist", "/settings"],
    [ROLES.MODERATOR]: [
      "/dashboard",
      "/stations",
      "/station-comparison",
      "/revenue",
      "/blacklist",
      "/notifications",
      "/settings",
      "/slots",
    ],
    [ROLES.ADMIN]: [
      "/dashboard",
      "/stations",
      "/station/:imei",
      "/station-comparison",
      "/revenue",
      "/users",
      "/blacklist",
      "/notifications",
      "/settings",
      "/slots",
    ],
  };

  return routes[userRole] || [];
};

// Check if user can access a route
export const canAccessRoute = (path) => {
  const allowedRoutes = getAllowedRoutes();

  // Check exact match
  if (allowedRoutes.includes(path)) return true;

  // Check pattern match (e.g., /station/:imei)
  return allowedRoutes.some((route) => {
    if (route.includes(":")) {
      const pattern = route.replace(/:[^/]+/g, "[^/]+");
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(path);
    }
    return false;
  });
};
