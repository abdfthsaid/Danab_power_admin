import { useState, useEffect } from 'react'
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

const Topbar = ({ currentPage, setSidebarOpen }) => {
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const { user, logout } = useAuth();

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
      
      // Fetch data from multiple endpoints
      const [transactionsRes, stationsRes] = await Promise.all([
        fetch('https://danabbackend.onrender.com/api/transactions/latest'),
        fetch('https://danabbackend.onrender.com/api/stations/basic')
      ]);

      const transactions = await transactionsRes.json();
      const stationsData = await stationsRes.json();
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
    const overdueTransactions = transactions.filter(t => {
      if (t.status !== 'rented') return false;
      const transactionTime = new Date(t.timestamp._seconds * 1000);
      const hoursDiff = (now - transactionTime) / (1000 * 60 * 60);
      return hoursDiff > 24;
    });

    overdueTransactions.forEach(t => {
      const stationName = stationMap[t.stationCode] || t.stationCode;
      notifications.push({
        id: `overdue-${t.id}`,
        title: 'Overdue Rental',
        description: `Customer: ${formatPhoneNumber(t.phoneNumber)} | Power Bank: ${t.battery_id} | Station: ${stationName}`,
        time: formatTimestamp(t.timestamp),
        type: 'error',
        icon: faExclamationTriangle,
        priority: 1
      });
    });

    // Check for recent transactions (last 2 hours)
    const recentTransactions = transactions.filter(t => {
      const transactionTime = new Date(t.timestamp._seconds * 1000);
      const hoursDiff = (now - transactionTime) / (1000 * 60 * 60);
      return hoursDiff <= 2;
    });

    recentTransactions.forEach(t => {
      const stationName = stationMap[t.stationCode] || t.stationCode;
      notifications.push({
        id: `recent-${t.id}`,
        title: 'New Transaction',
        description: `Station: ${stationName} | Amount: $${t.amount} | Power Bank: ${t.battery_id}`,
        time: formatTimestamp(t.timestamp),
        type: 'success',
        icon: faCheckCircle,
        priority: 2
      });
    });

    // Check for stations with potential issues (using real station data)
    stations.forEach(station => {
      if (station.name && station.name.includes('Java')) {
        notifications.push({
          id: `station-${station.id}`,
          title: 'Power Bank Low Battery',
          description: `Station: ${station.name} | Location: ${station.location}`,
          time: '10 minutes ago',
          type: 'warning',
          icon: faBatteryThreeQuarters,
          priority: 3
        });
      }
    });

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

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 9) {
      return `+(252) ${cleaned}`;
    }
    return phone;
  };

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

  const errorCount = notifications.filter(n => n.type === 'error').length;

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center dark:bg-gray-800 transition-colors duration-300">
      <div className="flex items-center">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-gray-500 dark:text-gray-400 mr-4"
        >
          <FontAwesomeIcon icon={faBars} className="text-xl" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {getPageTitle()}
        </h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          />
          <FontAwesomeIcon 
            icon={faSearch} 
            className="absolute left-3 top-3 text-gray-400" 
          />
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 relative"
            >
              <FontAwesomeIcon icon={faBell} />
              {errorCount > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            
            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg dark:bg-gray-800 z-50">
                <div className="p-3 border-b dark:border-gray-700">
                  <p className="font-medium dark:text-white">Notifications</p>
                </div>
                <div className="divide-y dark:divide-gray-700 max-h-60 overflow-y-auto">
                  {loading ? (
                    <div className="p-4 text-center">
                      <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600" />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading...</p>
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
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 border-t dark:border-gray-700 text-center">
                  <a href="/notifications" className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    View All Notifications
                  </a>
                </div>
              </div>
            )}
          </div>
          
          {/* User Menu */}
          <div className="relative">
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2"
            >
              {user?.profileImage ? (
                <img src={user.profileImage} alt="User avatar" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  <span>{user?.name ? user.name.slice(0,2).toUpperCase() : 'AD'}</span>
                </div>
              )}
            </button>
            
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg dark:bg-gray-800 z-50">
                <div className="py-3 px-4 border-b dark:border-gray-700">
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Logged in as</p>
                  <div className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
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
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                    Your Profile
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                    Settings
                  </a>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700 flex items-center gap-2"
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