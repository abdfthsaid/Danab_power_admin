const RevenueAnalytics = () => {
  const revenueData = [
    { month: 'Jul 2024', revenue: '$0', transactions: 0, avgValue: '$0.00' },
    { month: 'Aug 2024', revenue: '$0', transactions: 0, avgValue: '$0.00' },
    { month: 'Sep 2024', revenue: '$0', transactions: 0, avgValue: '$0.00' },
    { month: 'Oct 2024', revenue: '$0', transactions: 0, avgValue: '$0.00' },
    { month: 'Nov 2024', revenue: '$0', transactions: 0, avgValue: '$0.00' }
  ]

  return (
    <div className="bg-white rounded-lg shadow dark:bg-gray-800 transition-colors duration-300">
      <div className="p-4 border-b dark:border-gray-700">
        <h3 className="font-semibold text-lg dark:text-white">Revenue Analytics</h3>
      </div>
    
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-medium dark:text-white">Monthly Revenue</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Last 12 months performance</p>
          </div>
          <select className="px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
            <option>Last 12 Months</option>
            <option>Last 6 Months</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
          </select>
        </div>
        
        <div className="h-64 mb-4">
          <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Revenue Chart Placeholder</p>
          </div>
        </div>
        
        <div className="overflow-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Month</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Revenue</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Transactions</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Avg Value</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {revenueData.map((row, index) => (
                <tr key={index}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{row.month}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{row.revenue}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{row.transactions}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{row.avgValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default RevenueAnalytics 