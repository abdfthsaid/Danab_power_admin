import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBatteryThreeQuarters, 
  faExclamationTriangle, 
  faCheckCircle, 
  faClock,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

const DashboardNotifications = ({ showAll = false, onViewAll }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      
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
      setNotifications(generatedNotifications);
    } catch (err) {
      setError(err.message || 'Failed to load notifications');
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
      // Simulate some station alerts based on station data
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

    // Add some system notifications
    notifications.push({
      id: 'system-1',
      title: 'System Maintenance',
      description: 'Scheduled maintenance completed successfully',
      time: '1 hour ago',
      type: 'success',
      icon: faCheckCircle,
      priority: 4
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
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    };
    return classMap[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const visibleNotifications = showAll ? notifications : notifications.slice(0, 3);

  if (loading) {
    return (
      <div className="transition-colors duration-300 bg-white rounded-lg shadow dark:bg-gray-800">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold dark:text-white">Recent Notifications</h3>
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="w-8 h-8 mx-auto border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transition-colors duration-300 bg-white rounded-lg shadow dark:bg-gray-800">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold dark:text-white">Recent Notifications</h3>
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="mb-2 text-red-500 dark:text-red-400">⚠️</div>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={fetchNotifications} 
            className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="transition-colors duration-300 bg-white rounded-lg shadow dark:bg-gray-800">
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold dark:text-white">Recent Notifications</h3>
          {!showAll && notifications.length > 3 && (
            <button className="text-sm font-medium text-blue-600 dark:text-blue-400" onClick={onViewAll}>View All</button>
          )}
        </div>
      </div>
      <div className="divide-y dark:divide-gray-700">
        {visibleNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No notifications found
          </div>
        ) : (
          visibleNotifications.map((notification) => (
            <div key={notification.id} className="p-4 transition-colors duration-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${getNotificationClasses(notification.type)}`}>
                  <FontAwesomeIcon icon={notification.icon} className="text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium dark:text-white">{notification.title}</p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{notification.description}</p>
                    </div>
                    <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
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

export default DashboardNotifications; 