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
  faSpinner,
  faStore,
  faUsers,
  faExchangeAlt,
  faTimes
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../api/apiConfig';
import { isAdmin, getUserDisplayRole } from '../utils/roleUtils';

const Topbar = ({ currentPage, setSidebarOpen }) => {
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [allData, setAllData] = useState({
    stations: [],
    users: [],
    transactions: []
  })
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Check if user is admin using utility function
  const userIsAdmin = isAdmin(user)

  // Refs for dropdowns
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch all data for search
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setSearchLoading(true);
        const [stationsRes, usersRes, transactionsRes] = await Promise.all([
          apiService.getStations(),
          apiService.getUsers(),
          apiService.getLatestTransactions()
        ]);

        setAllData({
          stations: stationsRes.data.stations || [],
          users: usersRes.data || [],
          transactions: transactionsRes.data || []
        });
      } catch (err) {
        console.error('Error fetching search data:', err);
      } finally {
        setSearchLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Search functionality
  const performSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = [];
    const searchTerm = query.toLowerCase();

    // Search in stations
    allData.stations.forEach(station => {
      if (
        station.name?.toLowerCase().includes(searchTerm) ||
        station.location?.toLowerCase().includes(searchTerm) ||
        station.imei?.toLowerCase().includes(searchTerm) ||
        station.id?.toString().includes(searchTerm)
      ) {
        results.push({
          type: 'station',
          id: station.id,
          title: station.name,
          subtitle: station.location,
          icon: faStore,
          data: station
        });
      }
    });

    // Search in users (admin only)
    if (userIsAdmin) {
      allData.users.forEach(user => {
        if (
          user.username?.toLowerCase().includes(searchTerm) ||
          user.email?.toLowerCase().includes(searchTerm) ||
          user.fullName?.toLowerCase().includes(searchTerm) ||
          user.role?.toLowerCase().includes(searchTerm)
        ) {
          results.push({
            type: 'user',
            id: user.id,
            title: user.username || user.fullName,
            subtitle: user.email || user.role,
            icon: faUsers,
            data: user
          });
        }
      });
    }

    // Search in transactions
    allData.transactions.forEach(transaction => {
      if (
        transaction.id?.toString().includes(searchTerm) ||
        transaction.stationName?.toLowerCase().includes(searchTerm) ||
        transaction.battery_id?.toLowerCase().includes(searchTerm) ||
        transaction.phoneNumber?.includes(searchTerm) ||
        transaction.status?.toLowerCase().includes(searchTerm) ||
        transaction.amount?.toString().includes(searchTerm)
      ) {
        results.push({
          type: 'transaction',
          id: transaction.id,
          title: `Transaction #${transaction.id}`,
          subtitle: `${transaction.stationName} - $${transaction.amount}`,
          icon: faExchangeAlt,
          data: transaction
        });
      }
    });

    setSearchResults(results.slice(0, 10)); // Limit to 10 results
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    performSearch(query);
    setSearchOpen(query.length > 0);
  };

  // Handle search result click
  const handleSearchResultClick = (result) => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchOpen(false);

    switch (result.type) {
      case 'station':
        navigate(`/station/${result.data.imei}`);
        break;
      case 'user':
        navigate('/users');
        break;
      case 'transaction':
        navigate('/dashboard');
        break;
      default:
        break;
    }
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: t('dashboard'),
      stations: t('stations'),
      slots: t('slots'),
      revenue: t('revenue'),
      rentals: 'Active Rentals',
      users: t('users'),
      powerbanks: 'Power Banks',
      notifications: t('notifications'),
      settings: t('settings')
    }
    return titles[currentPage] || t('dashboard')
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
        {/* Search Bar - Desktop */}
        <div className="relative hidden md:block" ref={searchRef}>
          <div className="relative">
            <input 
              type="text" 
              placeholder={t('search')} 
              value={searchQuery}
              onChange={handleSearchChange}
              className="py-2 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute text-gray-400 left-3 top-3" 
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setSearchOpen(false);
                }}
                className="absolute text-gray-400 right-3 top-3 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
          
          {/* Search Results Dropdown */}
          {searchOpen && (
            <div className="absolute right-0 z-50 mt-2 bg-white rounded-md shadow-lg w-96 dark:bg-gray-800 max-h-96 overflow-y-auto">
              <div className="p-3 border-b dark:border-gray-700">
                <p className="font-medium dark:text-white">
                  {searchLoading ? t('loading') : `${searchResults.length} ${t('search')} ${t('results')}`}
                </p>
              </div>
              <div className="divide-y dark:divide-gray-700">
                {searchLoading ? (
                  <div className="p-4 text-center">
                    <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600" />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t('loading')}</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    {searchQuery ? t('noDataFound') : t('search')}
                  </div>
                ) : (
                  searchResults.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleSearchResultClick(result)}
                      className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <FontAwesomeIcon icon={result.icon} className="text-blue-600 dark:text-blue-400 text-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium dark:text-white truncate">
                            {result.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {result.subtitle}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            result.type === 'station' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            result.type === 'user' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {result.type}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Search Button */}
        <button
          onClick={() => {
            // For mobile, we could open a modal or navigate to a search page
            // For now, let's just focus the search input if it exists
            const searchInput = document.querySelector('input[placeholder*="Search"]');
            if (searchInput) {
              searchInput.focus();
            } else {
              // If no search input, show a simple alert with search tips
              alert(`${t('search')} ${t('tips')}:\n- Station names\n- User names\n- Transaction IDs\n- Power bank IDs`);
            }
          }}
          className="md:hidden p-2 text-gray-500 rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
        
        <div className="flex items-center space-x-2">
          {/* Notifications - Show for all users but with different content based on role */}
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
                  <p className="font-medium dark:text-white">{t('notifications')}</p>
                  {!userIsAdmin && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">Limited view for regular users</p>
                  )}
                </div>
                <div className="overflow-y-auto divide-y dark:divide-gray-700 max-h-60">
                  {loading ? (
                    <div className="p-4 text-center">
                      <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600" />
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t('loading')}</p>
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
                    {t('viewAll')} {t('notifications')}
                  </a>
                </div>
              </div>
            )}
          </div>
          
          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2 p-2 text-gray-500 rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden md:block text-sm font-medium dark:text-white">
                {user?.username || 'User'}
              </span>
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 z-50 mt-2 bg-white rounded-md shadow-lg w-48 dark:bg-gray-800">
                <div className="p-3 border-b dark:border-gray-700">
                  <p className="font-medium dark:text-white">{user?.username || 'User'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {getUserDisplayRole(user)}
                  </p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setUserMenuOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {t('settings')}
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                      navigate('/login');
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    {t('signOut')}
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