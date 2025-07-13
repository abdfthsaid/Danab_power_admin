import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { loginUser, selectLoginLoading, selectLoginError, selectLoginSuccess, resetLoginState } from '../store/usersSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const loading = useSelector(selectLoginLoading);
  const error = useSelector(selectLoginError);
  const loginSuccess = useSelector(selectLoginSuccess);
  const [form, setForm] = useState({ username: '', password: '' });

  // Reset login state on mount
  useEffect(() => {
    dispatch(resetLoginState());
  }, [dispatch]);

  useEffect(() => {
    if (loginSuccess) {
      navigate('/dashboard', { replace: true });
    }
  }, [loginSuccess, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg width="100%" height="100%" className="h-full w-full">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div className="relative z-10 flex w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Left branding panel for large screens */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-blue-400 dark:from-blue-800 dark:to-blue-600 w-1/2 p-10 text-white">
          <div className="flex items-center mb-6">
            <FontAwesomeIcon icon={faBolt} className="text-4xl mr-3 animate-pulse" />
            <span className="text-3xl font-extrabold tracking-wide">Danab Power</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-blue-100 text-lg mb-8 text-center">Log in to access your dashboard and manage your power bank stations efficiently.</p>
          <div className="mt-auto text-xs text-blue-100 opacity-80">&copy; {new Date().getFullYear()} Danab Power. All rights reserved.</div>
        </div>
        {/* Login form panel */}
        <div className="flex-1 flex flex-col justify-center p-8 sm:p-12">
          <div className="mb-8 flex items-center justify-center md:hidden">
            <FontAwesomeIcon icon={faBolt} className="text-3xl text-blue-600 mr-2 animate-pulse" />
            <span className="text-2xl font-extrabold text-blue-600 dark:text-white tracking-wide">Danab Power</span>
          </div>
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-white">Admin Login</h2>
          {error && <div className="mb-4 text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300 rounded px-4 py-2 text-center font-medium">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-1 font-medium">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white transition-all"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-1 font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white transition-all"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="mt-8 text-center text-gray-400 text-xs">
            Powered by <span className="font-bold text-blue-600 dark:text-blue-400">Danab Power</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 