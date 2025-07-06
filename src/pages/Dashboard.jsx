import StatsCards from '../components/StatsCards'
import Transactions from '../components/Transactions'
import QuickActions from '../components/QuickActions'
import StationStatus from '../components/StationStatus'
import RevenueAnalytics from '../components/RevenueAnalytics'

const Dashboard = () => {
  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCards />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Transactions />
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