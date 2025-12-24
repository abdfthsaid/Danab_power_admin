import { createContext, useContext, useState, useEffect, useRef } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const timeoutRef = useRef(null);

  // Check if token is expired
  const isTokenExpired = () => {
    const expiresAt = localStorage.getItem("tokenExpiresAt");
    if (!expiresAt) return true;
    return Date.now() >= parseInt(expiresAt, 10);
  };

  // Setup auto-logout timer based on token expiry
  const setupAutoLogout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const expiresAt = localStorage.getItem("tokenExpiresAt");
    if (!expiresAt) return;

    const timeUntilExpiry = parseInt(expiresAt, 10) - Date.now();
    if (timeUntilExpiry <= 0) {
      logout();
      return;
    }

    // Set timeout to logout when token expires
    timeoutRef.current = setTimeout(() => {
      logout();
      window.location.href = "/login";
    }, timeUntilExpiry);
  };

  useEffect(() => {
    // Load user from localStorage if exists and token is valid
    const saved = localStorage.getItem("sessionUser");
    const token = localStorage.getItem("authToken");

    if (saved && token && !isTokenExpired()) {
      setUser(JSON.parse(saved));
      setupAutoLogout();
    } else if (saved || token) {
      // Clear expired session
      logout();
    }
    setAuthLoading(false);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line
  }, []);

  const login = (userData, token, expiresAt) => {
    setUser(userData);
    localStorage.setItem("sessionUser", JSON.stringify(userData));
    if (token) {
      localStorage.setItem("authToken", token);
    }
    if (expiresAt) {
      localStorage.setItem("tokenExpiresAt", expiresAt.toString());
    }
    setupAutoLogout();
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sessionUser");
    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenExpiresAt");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, authLoading, isTokenExpired }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
