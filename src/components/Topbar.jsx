import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faBars, 
  faSearch, 
  faBell, 
  faBatteryThreeQuarters,
  faExclamationTriangle,
  faCheckCircle,
  faSignOutAlt,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import { apiService } from '../api/apiConfig';

const Topbar = ({ currentPage, setSidebarOpen }) => {
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Refs for dropdowns
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getPageTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      stations: 'Stations',
      slots: 'Slot Management',
      revenue: 'Revenue Analytics',
      rentals: 'Active Rentals',
      users: 'Users',
      powerbanks: 'Power Banks',
      notifications: 'Notifications',
      settings: 'Profile & Settings'
    }
    return titles[currentPage] || 'Dashboard'
  }

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      // Fetch data from multiple endpoints using apiService
      const [transactionsRes, stationsRes] = await Promise.all([
        apiService.getLatestTransactions(),
        apiService.getStations()
      ]);

      const transactions = transactionsRes.data;
      const stationsData = stationsRes.data;
      const stations = stationsData.stations || [];

      // Create a map of station codes to station names
      const stationMap = {};
      stations.forEach(station => {
        stationMap[station.imei] = station.name;
      });

      // Generate notifications based on the data
      const generatedNotifications = generateNotifications(transactions, stations, stationMap);
      setNotifications(generatedNotifications.slice(0, 5)); // Show only top 5 in dropdown
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const generateNotifications = (transactions, stations, stationMap) => {
    const notifications = [];

    // Check for overdue rentals (transactions older than 24 hours with 'rented' status)
    const now = new Date();
    // const overdueTransactions = transactions.filter(t => {
    //   if (t.status !== 'rented') return false;
    //   const transactionTime = new Date(t.timestamp._seconds * 1000);
    //   const hoursDiff = (now - transactionTime) / (1000 * 60 * 60);
    //   return hoursDiff > 24;
    // });

    // overdueTransactions.forEach(t => {
    //   const stationName = stationMap[t.stationCode] || t.stationCode;
    //   notifications.push({
    //     id: `overdue-${t.id}`,
    //     title: 'Overdue Rental',
    //     description: `Customer: ${formatPhoneNumber(t.phoneNumber)} | Power Bank: ${t.battery_id} | Station: ${stationName}`,
    //     time: formatTimestamp(t.timestamp),
    //     type: 'error',
    //     icon: faExclamationTriangle,
    //     priority: 1
    //   });
    // });

    // Check for recent transactions (last 2 hours)
    const recentTransactions = transactions.filter(t => {
      const transactionTime = new Date(t.timestamp._seconds * 1000);
      const hoursDiff = (now - transactionTime) / (1000 * 60 * 60);
      return hoursDiff <= 2;
    });

    recentTransactions.forEach(t => {
      // const stationName = stationMap[t.stationCode] || t.stationCode;
      notifications.push({
        id: `recent-${t.id}`,
        title: 'New Transaction',
        description: `Station: ${t.stationName} | Amount: $${t.amount} | Power Bank: ${t.battery_id}`,
        time: formatTimestamp(t.timestamp),
        type: 'success',
        icon: faCheckCircle,
        priority: 2
      });
    });

    // Check for stations with potential issues (using real station data)
    // stations.forEach(station => {
    //   if (station.name && station.name.includes('Java')) {
    //     notifications.push({
    //       id: `station-${station.id}`,
    //       title: 'Power Bank Low Battery',
    //       description: `Station: ${station.name} | Location: ${station.location}`,
    //       time: '10 minutes ago',
    //       type: 'warning',
    //       icon: faBatteryThreeQuarters,
    //       priority: 3
    //     });
    //   }
    // });

    // Sort by priority and time
    return notifications.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return new Date(b.time) - new Date(a.time);
    });
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp || !timestamp._seconds) return 'Unknown time';
    
    const date = new Date(timestamp._seconds * 1000);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  // const formatPhoneNumber = (phone) => {
  //   if (!phone) return 'N/A';
  //   const cleaned = phone.replace(/\D/g, '');
  //   if (cleaned.length === 9) {
  //     return `+(252) ${cleaned}`;
  //   }
  //   return phone;
  // };

  const getNotificationClasses = (type) => {
    const classMap = {
      warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400',
      error: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400',
      success: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
    };
    return classMap[type] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
  };

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (notificationOpen) {
      fetchNotifications();
    }
  }, [notificationOpen]);

  // Fetch notifications on mount for initial badge count
  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line
  }, []);

  const errorCount = notifications.filter(n => n.type === 'error').length;
  // Count of new notifications
  const notificationCount = notifications.length;

  return (
    <header className="flex items-center justify-between p-4 transition-colors duration-300 bg-white shadow-sm dark:bg-gray-800">
      <div className="flex items-center">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="mr-4 text-gray-500 lg:hidden dark:text-gray-400"
        >
          <FontAwesomeIcon icon={faBars} className="text-xl" />
        </button>
        <h2
          className="text-xl font-semibold text-gray-800 transition-colors cursor-pointer dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
          onClick={() => navigate('/dashboard')}
        >
          {getPageTitle()}
        </h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <input 
            type="text" 
            placeholder="Search..." 
            className="py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          />
          <FontAwesomeIcon 
            icon={faSearch} 
            className="absolute text-gray-400 left-3 top-3" 
          />
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative p-2 text-gray-500 rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FontAwesomeIcon icon={faBell} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center z-10">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </button>
            {notificationOpen && (
              <div className="absolute right-0 z-50 mt-2 bg-white rounded-md shadow-lg w-72 dark:bg-gray-800">
                <div className="p-3 border-b dark:border-gray-700">
                  <p className="font-medium dark:text-white">Notifications</p>
                </div>
                <div className="overflow-y-auto divide-y dark:divide-gray-700 max-h-60">
                  {loading ? (
                    <div className="p-4 text-center">
                      <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600" />
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading...</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div key={notification.id} className="flex items-start p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${getNotificationClasses(notification.type)}`}>
                          <FontAwesomeIcon icon={notification.icon} />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium dark:text-white">{notification.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{notification.description}</p>
                          <p className="mt-1 text-xs text-gray-400">{notification.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 text-center border-t dark:border-gray-700">
                  <a href="/notifications" className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    View All Notifications
                  </a>
                </div>
              </div>
            )}
          </div>
          
          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2"
            >
              {user?.profileImage ? (
                <img src={user.profileImage} alt="User avatar" className="object-cover w-8 h-8 rounded-full" />
              ) : (
                <div className="flex items-center justify-center w-8 h-8 font-bold text-white bg-blue-500 rounded-full">
                  <span>{user?.name ? user.name.slice(0,2).toUpperCase() : 'AD'}</span>
                </div>
              )}
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 z-50 w-64 mt-2 bg-white rounded-md shadow-lg dark:bg-gray-800">
                <div className="px-4 py-3 border-b dark:border-gray-700">
                  <p className="mb-1 text-xs text-gray-400 dark:text-gray-500">Logged in as</p>
                  <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-white">
                    {user?.name || 'Guest'}
                    {user?.role && (
                      <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${user.role === 'admin' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">{user?.email || ''}</div>
                </div>
                <div className="py-1">
                  {/* <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                    Your Profile
                  </a> */}
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                    Settings
                  </a>
                  <button
                    onClick={logout}
                    className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar 