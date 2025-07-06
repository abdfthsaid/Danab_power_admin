import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faDollarSign, 
  faUsers, 
  faBatteryThreeQuarters, 
  faStore,
  faChartLine,
  faArrowUp,
  faArrowDown,
  faClock,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons'

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$72,450',
      change: '+15.3%',
      changeType: 'positive',
      icon: faDollarSign,
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Active Users',
      value: '2,847',
      change: '+8.2%',
      changeType: 'positive',
      icon: faUsers,
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Power Banks',
      value: '156',
      change: '+12.1%',
      changeType: 'positive',
      icon: faBatteryThreeQuarters,
      color: 'purple',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Stations',
      value: '24',
      change: '+4.5%',
      changeType: 'positive',
      icon: faStore,
      color: 'orange',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
      textColor: 'text-orange-600 dark:text-orange-400'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'rental',
      user: 'Ahmed Hassan',
      station: 'Cafe Castello Boondheere',
      time: '2 minutes ago',
      amount: '$2.50'
    },
    {
      id: 2,
      type: 'return',
      user: 'Fatima Ali',
      station: 'Java Taleex',
      time: '5 minutes ago',
      amount: '$3.00'
    },
    {
      id: 3,
      type: 'rental',
      user: 'Omar Mohamed',
      station: 'Cafe Castello Taleex',
      time: '8 minutes ago',
      amount: '$2.50'
    },
    {
      id: 4,
      type: 'return',
      user: 'Aisha Ahmed',
      station: 'Cafe Castello Cali K Cali Kamlin',
      time: '12 minutes ago',
      amount: '$4.00'
    }
  ]

  const topStations = [
    {
      name: 'Cafe Castello Boondheere',
      revenue: '$8,450',
      rentals: 320,
      availability: 85
    },
    {
      name: 'Java Taleex',
      revenue: '$7,200',
      rentals: 280,
      availability: 92
    },
    {
      name: 'Cafe Castello Taleex',
      revenue: '$6,800',
      rentals: 250,
      availability: 78
    }
  ]

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, Admin! 👋</h2>
            <p className="text-blue-100">Here's what's happening with your power bank rental business today.</p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-blue-100 text-sm">Current Time</p>
              <p className="text-xl font-semibold">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold dark:text-white mt-1">{stat.value}</h3>
                <div className="flex items-center mt-2">
                  <FontAwesomeIcon 
                    icon={stat.changeType === 'positive' ? faArrowUp : faArrowDown} 
                    className={`mr-1 text-sm ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`} 
                  />
                  <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <FontAwesomeIcon icon={stat.icon} className={`text-xl ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold dark:text-white">Revenue Overview</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Last 7 days performance</p>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium">Daily</button>
              <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium">Weekly</button>
            </div>
          </div>
          
          {/* Simple Bar Chart */}
          <div className="h-64 flex items-end justify-between space-x-2">
            {[1200, 1350, 1100, 1400, 1600, 1800, 2000].map((value, index) => {
              const height = (value / 2000) * 100
              const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t-sm relative group">
                    <div
                      className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm transition-all duration-300 group-hover:from-blue-500 group-hover:to-blue-300"
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      ${value.toLocaleString()}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">{days[index]}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold dark:text-white">Recent Activity</h3>
            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'rental' 
                    ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' 
                    : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                }`}>
                  <FontAwesomeIcon 
                    icon={activity.type === 'rental' ? faBatteryThreeQuarters : faStore} 
                    className="text-sm" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium dark:text-white">
                    {activity.user}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.type === 'rental' ? 'Rented' : 'Returned'} at {activity.station}
                  </p>
                  <div className="flex items-center mt-1">
                    <FontAwesomeIcon icon={faClock} className="text-xs text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">{activity.amount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Stations and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Stations */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold dark:text-white mb-4">Top Performing Stations</h3>
          <div className="space-y-4">
            {topStations.map((station, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faStore} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium dark:text-white text-sm">{station.name}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{station.rentals} rentals</span>
                      <span>{station.availability}% available</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold dark:text-white text-sm">{station.revenue}</p>
                  <p className="text-xs text-green-500">+12.5%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200 text-left">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-2">
                <FontAwesomeIcon icon={faStore} className="text-blue-600 dark:text-blue-400" />
              </div>
              <p className="font-medium dark:text-white text-sm">Add Station</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Create new location</p>
            </button>
            
            <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200 text-left">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-2">
                <FontAwesomeIcon icon={faBatteryThreeQuarters} className="text-green-600 dark:text-green-400" />
              </div>
              <p className="font-medium dark:text-white text-sm">Add Power Banks</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Inventory management</p>
            </button>
            
            <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200 text-left">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-2">
                <FontAwesomeIcon icon={faUsers} className="text-purple-600 dark:text-purple-400" />
              </div>
              <p className="font-medium dark:text-white text-sm">Manage Users</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">User administration</p>
            </button>
            
            <button className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors duration-200 text-left">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-2">
                <FontAwesomeIcon icon={faChartLine} className="text-orange-600 dark:text-orange-400" />
              </div>
              <p className="font-medium dark:text-white text-sm">View Reports</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Analytics & insights</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 