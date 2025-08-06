import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBatteryThreeQuarters, 
  faExclamationTriangle, 
  faCheckCircle, 
  faClock,
  faSpinner,
  faRefresh
} from '@fortawesome/free-solid-svg-icons';
import { apiService } from '../api/apiConfig';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, warning, error, success

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      
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
        stationMap[station.imei] = station.stationName || station.name;
      });

      // Generate notifications based on the data
      const generatedNotifications = generateNotifications(transactions, stations, stationMap);
      setNotifications(generatedNotifications);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load notifications');
      console.error('Error fetching notifications:', err);
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
    //   // Simulate some station alerts based on station data
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

    // Add some system notifications
    // notifications.push({
    //   id: 'system-1',
    //   title: 'System Maintenance',
    //   description: 'Scheduled maintenance completed successfully',
    //   time: '1 hour ago',
    //   type: 'success',
    //   icon: faCheckCircle,
    //   priority: 4
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

  const getNotificationIcon = (type) => {
    const iconMap = {
      warning: faBatteryThreeQuarters,
      error: faExclamationTriangle,
      success: faCheckCircle,
      info: faClock
    };
    return iconMap[type] || faClock;
  };

  const getNotificationClasses = (type) => {
    const classMap = {
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    };
    return classMap[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    return notification.type === filter;
  });

  const getFilterCount = (type) => {
    return notifications.filter(n => type === 'all' ? true : n.type === type).length;
  };

  if (loading) {
    return (
      <div className="max-w-4xl p-4 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold dark:text-white">All Notifications</h2>
          <div className="w-6 h-6 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 bg-white rounded-lg shadow dark:bg-gray-800 animate-pulse">
              <div className="w-3/4 h-4 mb-2 bg-gray-200 rounded dark:bg-gray-700"></div>
              <div className="w-1/2 h-3 mb-2 bg-gray-200 rounded dark:bg-gray-700"></div>
              <div className="w-1/4 h-3 bg-gray-200 rounded dark:bg-gray-700"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl p-4 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold dark:text-white">All Notifications</h2>
        <button
          onClick={fetchNotifications}
          className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <FontAwesomeIcon icon={faRefresh} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex mb-6 space-x-2">
        {[
          { key: 'all', label: 'All', color: 'gray' },
          { key: 'error', label: 'Errors', color: 'red' },
          { key: 'warning', label: 'Warnings', color: 'yellow' },
          { key: 'success', label: 'Success', color: 'green' }
        ].map(filterOption => (
          <button
            key={filterOption.key}
            onClick={() => setFilter(filterOption.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === filterOption.key
                ? `bg-${filterOption.color}-100 text-${filterOption.color}-800 dark:bg-${filterOption.color}-900 dark:text-${filterOption.color}-200`
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {filterOption.label} ({getFilterCount(filterOption.key)})
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-300">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
            {error}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="py-12 text-center">
            <FontAwesomeIcon 
              icon={getNotificationIcon(filter === 'all' ? 'info' : filter)} 
              className="mb-4 text-4xl text-gray-400 dark:text-gray-600" 
            />
            <p className="text-gray-500 dark:text-gray-400">
              {filter === 'all' ? 'No notifications found' : `No ${filter} notifications found`}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className="p-4 transition-shadow bg-white rounded-lg shadow dark:bg-gray-800 hover:shadow-md"
            >
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${getNotificationClasses(notification.type)}`}>
                  <FontAwesomeIcon icon={notification.icon} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold dark:text-white">{notification.title}</p>
                      <p className="mt-1 text-gray-500 dark:text-gray-400">{notification.description}</p>
                    </div>
                    <span className="ml-4 text-xs text-gray-400 dark:text-gray-500">
                      {notification.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications; 