import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faMoneyBillWave, faChartBar, faChartLine, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StationDetails = () => {
  const { imei } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [daily, setDaily] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [charts, setCharts] = useState(null);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [chartsError, setChartsError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

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

  useEffect(() => {
    const fetchCharts = async () => {
      setChartsLoading(true);
      setChartsError('');
      try {
        const res = await fetch(`https://danabbackend.onrender.com/api/charts/${imei}`);
        if (!res.ok) throw new Error('Failed to fetch charts');
        const data = await res.json();
        setCharts(data);
        setLastUpdated(new Date().toLocaleString());
      } catch (err) {
        setChartsError('Failed to fetch chart data');
      } finally {
        setChartsLoading(false);
      }
    };
    fetchCharts();
  }, [imei]);

  // Prepare chart.js data for Revenue-style charts
  const dailyRevenueLineData = charts && charts.dailyRevenue ? {
    labels: charts.dailyRevenue.labels,
    datasets: [
      {
        label: 'Daily Revenue ($)',
        data: charts.dailyRevenue.data,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  } : null;

  const monthlyRevenueLineData = charts && charts.monthlyRevenue ? {
    labels: charts.monthlyRevenue.labels,
    datasets: [
      {
        label: 'Monthly Revenue ($)',
        data: charts.monthlyRevenue.data,
        borderColor: '#f59e42',
        backgroundColor: 'rgba(245, 158, 66, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  } : null;

  const weeklyRevenueBarData = charts && charts.weeklyRevenue ? {
    labels: charts.weeklyRevenue.labels,
    datasets: [
      {
        label: 'Weekly Revenue ($)',
        data: charts.weeklyRevenue.data,
        backgroundColor: '#6366f1',
        borderRadius: 8,
      },
    ],
  } : null;

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-blue-200/60 via-white to-blue-400/40 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <div className="relative w-full py-16 px-4 bg-gradient-to-br from-blue-700 via-blue-500 to-indigo-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-2xl mb-16 rounded-b-[3rem] flex flex-col items-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/public/vite.svg')] bg-no-repeat bg-right-bottom opacity-10 pointer-events-none" />
        <button
          onClick={() => navigate('/stations')}
          className="flex items-center px-6 py-2 mb-8 text-xl font-bold text-blue-800 transition shadow-lg rounded-2xl bg-white/60 hover:bg-blue-100 dark:bg-gray-800/80 dark:hover:bg-blue-900 dark:text-blue-200 backdrop-blur"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-4 text-2xl" /> Back to Stations
        </button>
        <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-white md:text-6xl dark:text-blue-200 drop-shadow-lg">Station Details</h1>
        <div className="mb-2 text-2xl font-semibold text-blue-100 md:text-3xl dark:text-blue-300">IMEI: <span className="font-mono text-3xl text-white dark:text-blue-200">{imei}</span></div>
       
      </div>
      {/* Summary Cards Section */}
      <div className="px-4 mx-auto mb-20 max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-4xl font-extrabold tracking-tight dark:text-white">Station Performance Summary</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400">Key revenue and rental stats for this station, presented in a beautiful, modern layout.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-14">
          <div className="relative flex flex-col items-center p-10 transition-shadow duration-200 border-t-8 border-indigo-500 shadow-xl bg-white/90 dark:bg-gray-800/90 rounded-2xl hover:shadow-2xl backdrop-blur-lg group">
            <span className="absolute p-3 text-4xl text-white transition-transform -translate-x-1/2 bg-indigo-500 border-4 border-white rounded-full shadow-lg -top-6 left-1/2 dark:border-gray-900 group-hover:scale-110"><FontAwesomeIcon icon={faMoneyBillWave} /></span>
            <h4 className="mt-6 mb-8 text-2xl font-bold tracking-tight dark:text-white">Today's Revenue</h4>
            <div className="mb-4 text-5xl font-extrabold text-indigo-700 dark:text-indigo-300">${daily?.totalRevenueToday?.toFixed(2) ?? '-'}</div>
            <div className="mb-1 text-xl text-gray-500 dark:text-gray-400">{daily?.totalRentalsToday ?? '-'} rentals today</div>
            <div className="mt-2 text-lg text-gray-400">Date: {daily?.date || '-'}</div>
          </div>
          <div className="relative flex flex-col items-center p-10 transition-shadow duration-200 border-t-8 border-blue-500 shadow-xl bg-white/90 dark:bg-gray-800/90 rounded-2xl hover:shadow-2xl backdrop-blur-lg group">
            <span className="absolute p-3 text-4xl text-white transition-transform -translate-x-1/2 bg-blue-500 border-4 border-white rounded-full shadow-lg -top-6 left-1/2 dark:border-gray-900 group-hover:scale-110"><FontAwesomeIcon icon={faChartBar} /></span>
            <h4 className="mt-6 mb-8 text-2xl font-bold tracking-tight dark:text-white">Monthly Revenue</h4>
            <div className="mb-4 text-5xl font-extrabold text-blue-700 dark:text-blue-300">${monthly?.totalRevenueMonthly?.toFixed(2) ?? '-'}</div>
            <div className="mb-1 text-xl text-gray-500 dark:text-gray-400">{monthly?.totalRentalsThisMonth ?? '-'} rentals this month</div>
            <div className="mt-2 text-lg text-gray-400">Month: {monthly?.month || '-'}</div>
          </div>
        </div>
      </div>
      {/* Charts Section */}
      <div className="max-w-7xl mx-auto bg-white/70 dark:bg-gray-900/80 rounded-[2.5rem] p-14 shadow-2xl backdrop-blur-lg">
        <div className="mb-12 text-center">
          <h3 className="mb-3 text-4xl font-extrabold tracking-tight dark:text-white">Station Revenue Trends</h3>
          <p className="text-xl text-gray-500 dark:text-gray-400">Visual breakdown of daily, weekly, and monthly revenue for this station.</p>
        </div>
        {chartsLoading ? (
          <div className="py-20 text-3xl text-center text-gray-500 dark:text-gray-400">Loading charts...</div>
        ) : chartsError ? (
          <div className="py-20 text-3xl text-center text-red-600 dark:text-red-400">{chartsError}</div>
        ) : charts && (
          <>
            <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
              <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold dark:text-white">Daily Revenue Trend</h3>
                <Line data={dailyRevenueLineData} options={{ responsive: true, plugins: { legend: { display: true } } }} height={120} />
              </div>
              <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold dark:text-white">Monthly Revenue Trend</h3>
                <Line data={monthlyRevenueLineData} options={{ responsive: true, plugins: { legend: { display: true } } }} height={120} />
              </div>
            </div>
            <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold dark:text-white">Weekly Revenue Breakdown</h3>
              <Bar data={weeklyRevenueBarData} options={{ responsive: true, plugins: { legend: { display: false } } }} height={80} />
            </div>
          </>
        )}
        {/* Last updated timestamp */}
        {lastUpdated && (
          <div className="mt-10 text-lg text-center text-gray-400">Last updated: {lastUpdated}</div>
        )}
      </div>
      {/* Call to Action / Summary */}
      {/* <div className="max-w-3xl mx-auto mt-16 text-center">
        <div className="p-10 shadow-xl bg-gradient-to-r from-blue-500/80 to-indigo-500/80 dark:from-gray-800 dark:to-gray-900 rounded-2xl">
          <h2 className="mb-3 text-3xl font-extrabold text-white">Ready to impress your stakeholders?</h2>
          <p className="mb-6 text-xl text-blue-100">Share this dashboard or export the data to PDF for your next meeting. Beautiful, interactive analytics at your fingertips.</p>
          <button className="px-8 py-3 text-lg font-bold text-blue-700 transition shadow-lg rounded-xl bg-white/90 hover:bg-blue-100">Export to PDF</button>
        </div>
      </div> */}
    </div>
  );
};

export default StationDetails; 