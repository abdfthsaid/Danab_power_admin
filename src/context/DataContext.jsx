import { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../api/apiConfig';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [stations, setStations] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [stationsRes, transactionsRes, usersRes] = await Promise.all([
        apiService.getStations(),
        apiService.getLatestTransactions(),
        apiService.getUsers().catch(() => ({ data: [] })) // Users might fail for non-admins
      ]);

      setStations(stationsRes.data.stations || []);
      setTransactions(transactionsRes.data || []);
      setUsers(usersRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const refetch = () => {
    fetchAllData();
  };

  const value = {
    stations,
    transactions,
    users,
    loading,
    error,
    refetch
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
