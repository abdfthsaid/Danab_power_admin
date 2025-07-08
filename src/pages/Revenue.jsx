import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const lineData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Revenue ($)',
      data: [1200, 1900, 1700, 2200, 2100, 2500, 2300, 2400, 2000, 2600, 2700, 3000],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      tension: 0.4,
      fill: true,
    },
  ],
};

const barData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Monthly Revenue',
      data: [1200, 1900, 1700, 2200, 2100, 2500, 2300, 2400, 2000, 2600, 2700, 3000],
      backgroundColor: '#6366f1',
      borderRadius: 8,
    },
  ],
};

const pieData = {
  labels: ['Station Rentals', 'Power Bank Sales', 'Accessories'],
  datasets: [
    {
      label: 'Revenue by Category',
      data: [7000, 3500, 1500],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e42'],
      borderWidth: 1,
    },
  ],
};

const Revenue = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold dark:text-white">Revenue Analytics</h3>
          <p className="text-gray-500 dark:text-gray-400">Detailed revenue analysis and reporting</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-6 col-span-2">
          <h3 className="font-semibold text-lg dark:text-white mb-4">Revenue Trend (Yearly)</h3>
          <Line data={lineData} options={{ responsive: true, plugins: { legend: { display: true } } }} height={120} />
        </div>
        <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-6">
          <h3 className="font-semibold text-lg dark:text-white mb-4">Revenue by Category</h3>
          <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-6">
        <h3 className="font-semibold text-lg dark:text-white mb-4">Monthly Revenue Breakdown</h3>
        <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} height={80} />
      </div>
    </div>
  );
};

export default Revenue; 