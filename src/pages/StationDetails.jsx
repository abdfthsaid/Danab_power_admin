import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faMoneyBillWave, faChartBar } from '@fortawesome/free-solid-svg-icons';

const StationDetails = () => {
  const { imei } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [daily, setDaily] = useState(null);
  const [monthly, setMonthly] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const [dailyRes, monthlyRes] = await Promise.all([
          fetch(`https://danabbackend.onrender.com/api/revenue/daily/${imei}`),
          fetch(`https://danabbackend.onrender.com/api/revenue/monthly/${imei}`)
        ]);
        const dailyData = await dailyRes.json();
        const monthlyData = await monthlyRes.json();
        setDaily(dailyData);
        setMonthly(monthlyData);
      } catch (err) {
        setError('Failed to fetch station stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [imei]);

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen flex flex-col">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/stations')}
          className="flex items-center px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-blue-100 dark:bg-gray-800 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold shadow transition mr-4"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Back to Stations
        </button>
        <h2 className="text-2xl font-bold dark:text-white flex-1">Station Details</h2>
      </div>
      <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 shadow flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-lg font-semibold text-gray-700 dark:text-gray-200">IMEI:</div>
          <div className="font-mono text-blue-700 dark:text-blue-300 text-xl">{imei}</div>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="text-sm text-gray-500 dark:text-gray-400">Station revenue and rental statistics</div>
        </div>
      </div>
      {loading ? (
        <div className="py-16 text-center text-gray-500 dark:text-gray-400 text-lg">Loading station stats...</div>
      ) : error ? (
        <div className="py-16 text-center text-red-600 dark:text-red-400 text-lg">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-lg p-6 flex flex-col items-center border-t-4 border-indigo-400">
            <FontAwesomeIcon icon={faMoneyBillWave} className="text-4xl text-indigo-500 mb-2" />
            <div className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">Today's Revenue</div>
            <div className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mb-2">${daily?.totalRevenueToday?.toFixed(2) ?? '-'}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{daily?.totalRentalsToday ?? '-'} rentals today</div>
            <div className="mt-2 text-xs text-gray-400">Date: {daily?.date || '-'}</div>
          </div>
          <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-lg p-6 flex flex-col items-center border-t-4 border-blue-400">
            <FontAwesomeIcon icon={faChartBar} className="text-4xl text-blue-500 mb-2" />
            <div className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">Monthly Revenue</div>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-2">${monthly?.totalRevenueMonthly?.toFixed(2) ?? '-'}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{monthly?.totalRentalsThisMonth ?? '-'} rentals this month</div>
            <div className="mt-2 text-xs text-gray-400">Month: {monthly?.month || '-'}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StationDetails; 