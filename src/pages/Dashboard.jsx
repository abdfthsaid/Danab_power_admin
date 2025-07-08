import StatsCards from '../components/StatsCards'
import QuickActions from '../components/QuickActions'
import StationStatus from '../components/StationStatus'
import RevenueAnalytics from '../components/RevenueAnalytics'
import Transactions from '../components/Transactions';


import { useState } from 'react'

const notifications = [
  {
    id: 1,
    title: 'Power Bank Low Battery',
    description: 'Station: Java Taleex Branch',
    time: '10 minutes ago',
    type: 'warning',
  },
  {
    id: 2,
    title: 'Overdue Rental',
    description: 'Customer: +(252) 618-519075',
    time: '1 hour ago',
    type: 'error',
  },
  {
    id: 3,
    title: 'New Station Added',
    description: 'Cafe Castello Boondheere',
    time: '3 hours ago',
    type: 'success',
  },
  // Add more notifications as needed
];

const Dashboard = () => {
  const [showAllNotifications, setShowAllNotifications] = useState(false);
      const [showAllTransactions, setShowAllTransactions] = useState(false);
  const visibleNotifications = showAllNotifications ? notifications : notifications.slice(0, 3);

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCards />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* <Transactions /> */}

         <Transactions
        showAll={showAllTransactions}
        onViewAll={() => setShowAllTransactions(true)}
      />
      {showAllTransactions && (
        <button
          className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400"
          onClick={() => setShowAllTransactions(false)}
        >
          Show Less
        </button>
      )}
              

        </div>
        {/* <div>
          <QuickActions />
        </div> */}
      </div>
      
      {/* Bottom Section - Stations and Revenue */}
      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2">
        <StationStatus />
        <RevenueAnalytics />
      </div>
    </div>
  )
}

export default Dashboard 