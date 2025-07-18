import StatsCards from '../components/StatsCards'
import QuickActions from '../components/QuickActions'
import StationStatus from '../components/StationStatus'
import RevenueAnalytics from '../components/RevenueAnalytics'
import Transactions from '../components/Transactions';
import DashboardNotifications from '../components/DashboardNotifications';

import { useState } from 'react'

const Dashboard = () => {
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCards />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
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
        <div>
          <DashboardNotifications
            showAll={showAllNotifications}
            onViewAll={() => setShowAllNotifications(true)}
          />
          {showAllNotifications && (
            <button
              className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400"
              onClick={() => setShowAllNotifications(false)}
            >
              Show Less
            </button>
          )}
        </div>
      </div>
      
      {/* Bottom Section - Stations and Revenue */}
      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2">
        {/* <StationStatus />
        <RevenueAnalytics /> */}
      </div>
    </div>
  )
}

export default Dashboard 