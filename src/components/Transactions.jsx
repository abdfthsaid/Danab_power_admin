import { useState, useEffect } from 'react';

const Transactions = ({ showAll = false, onViewAll }) => {
  const [transactions, setTransactions] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch both transactions and stations data
        const [transactionsRes, stationsRes] = await Promise.all([
          fetch('https://danabbackend.onrender.com/api/transactions/latest'),
          fetch('https://danabbackend.onrender.com/api/stations/basic')
        ]);

        const transactionsData = await transactionsRes.json();
        const stationsData = await stationsRes.json();
        
        if (!transactionsRes.ok) {
          throw new Error(transactionsData.error || 'Failed to fetch transactions');
        }
        
        setTransactions(transactionsData);
        setStations(stationsData.stations || []);
      } catch (err) {
        setError(err.message || 'Failed to load transactions');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStationName = (stationCode) => {
    const station = stations.find(s => s.imei === stationCode);
    return station ? station.name : stationCode;
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

  const getStatusClasses = (status) => {
    const statusMap = {
      'rented': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'returned': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'overdue': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const getStatusTextColor = (status) => {
    const statusMap = {
      'rented': 'text-blue-600 dark:text-blue-400',
      'returned': 'text-green-600 dark:text-green-400',
      'overdue': 'text-red-600 dark:text-red-400',
      'completed': 'text-green-600 dark:text-green-400'
    };
    return statusMap[status] || 'text-gray-600 dark:text-gray-400';
  };

  const formatAmount = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    // Remove any non-digit characters and format
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 9) {
      return `+(252) ${cleaned}`;
    }
    return phone;
  };

  const visibleTransactions = showAll ? transactions : transactions.slice(0, 3);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow dark:bg-gray-800 transition-colors duration-300">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg dark:text-white">Recent Transactions</h3>
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow dark:bg-gray-800 transition-colors duration-300">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg dark:text-white">Recent Transactions</h3>
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="text-red-500 dark:text-red-400 mb-2">⚠️</div>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-blue-600 dark:text-blue-400 text-sm font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow dark:bg-gray-800 transition-colors duration-300">
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg dark:text-white">Recent Transactions</h3>
          {!showAll && transactions.length > 3 && (
            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium" onClick={onViewAll}>View All</button>
          )}
        </div>
      </div>
      <div className="divide-y dark:divide-gray-700">
        {visibleTransactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No transactions found
          </div>
        ) : (
          visibleTransactions.map((transaction) => (
            <div key={transaction.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium dark:text-white">ID: {transaction.id}</p>
                  <div className="flex items-center mt-1">
                    <span className={`${getStatusClasses(transaction.status)} text-xs font-medium px-2 py-0.5 rounded-full`}>
                      {transaction.status}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">{formatTimestamp(transaction.timestamp)}</span>
                  </div>
                </div>
                <span className="font-bold dark:text-white">{formatAmount(transaction.amount)}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Customer</p>
                  <p className="font-medium dark:text-white">{formatPhoneNumber(transaction.phoneNumber)}</p>
                  <p className="text-sm dark:text-gray-300">Power Bank {transaction.battery_id}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Station</p>
                  <p className="font-medium dark:text-white">{getStationName(transaction.stationCode)}</p>
                  <p className="text-sm">Slot: <span className="text-blue-600 dark:text-blue-400">{transaction.slot_id}</span></p>
                </div>
              </div>
              <div className="mt-3 text-right">
                <button className="text-blue-600 dark:text-blue-400 text-sm font-medium">View Details →</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Transactions; 