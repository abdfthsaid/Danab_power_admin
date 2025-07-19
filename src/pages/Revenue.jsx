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
      data: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000,200,300],
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
       data: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000,100,400],
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
      <div className="flex flex-col mb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-2xl font-bold dark:text-white">Revenue Analytics</h3>
          <p className="text-gray-500 dark:text-gray-400">Detailed revenue analysis and reporting</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
        <div className="col-span-2 p-6 bg-white rounded-lg shadow dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">Revenue Trend (Yearly)</h3>
          <Line data={lineData} options={{ responsive: true, plugins: { legend: { display: true } } }} height={120} />
        </div>
        {/* <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">Revenue by Category</h3>
          <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
        </div> */}
      </div>
      <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold dark:text-white">Monthly Revenue Breakdown</h3>
        <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} height={80} />
      </div>
    </div>
  );
};

export default Revenue; 