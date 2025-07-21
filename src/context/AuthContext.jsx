import { createContext, useContext, useState, useEffect, useRef } from 'react';

const AuthContext = createContext();

const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes in ms

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const timeoutRef = useRef(null);

  // Helper to clear and set the session timeout
  const resetSessionTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (user) {
      timeoutRef.current = setTimeout(() => {
        logout();
      }, SESSION_TIMEOUT);
    }
  };

  // Listen for user activity to reset the timer
  useEffect(() => {
    if (!user) return;
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetSessionTimeout));
    resetSessionTimeout();
    return () => {
      events.forEach(event => window.removeEventListener(event, resetSessionTimeout));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    // Load user from localStorage if exists
    const saved = localStorage.getItem('sessionUser');
    if (saved) setUser(JSON.parse(saved));
    setAuthLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('sessionUser', JSON.stringify(userData));
    resetSessionTimeout();
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sessionUser');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 