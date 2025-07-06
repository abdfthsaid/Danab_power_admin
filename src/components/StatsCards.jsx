import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'

const StatsCards = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$471.50',
      change: '12.5% vs last week',
      progress: 75,
      color: 'blue'
    },
    {
      title: 'Active Rentals',
      value: '5',
      change: '8.3% vs last week',
      progress: 60,
      color: 'green'
    },
    {
      title: 'Total Customers',
      value: '518',
      change: '5.2% vs last week',
      progress: 85,
      color: 'purple'
    },
    {
      title: 'Avg. Rental Time',
      value: '2.4 hrs',
      change: '+2.1%',
      progress: 45,
      color: 'yellow'
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      yellow: 'bg-yellow-500'
    }
    return colors[color] || 'bg-blue-500'
  }

  return (
    <>
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6 dark:bg-gray-800 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.title}</p>
              <h3 className="text-2xl font-bold mt-1 dark:text-white">{stat.value}</h3>
            </div>
            <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-medium px-2 py-0.5 rounded-full flex items-center">
              <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
              {stat.change}
            </span>
          </div>
          <div className="mt-4 h-2 bg-gray-200 rounded-full dark:bg-gray-700">
            <div 
              className={`h-2 rounded-full ${getColorClasses(stat.color)}`} 
              style={{ width: `${stat.progress}%` }}
            ></div>
          </div>
        </div>
      ))}
    </>
  )
}

export default StatsCards 