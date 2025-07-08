import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'

const StatsCards = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$900.50',
      change: '50.5% vs last week',
      progress: 85,
      color: 'blue'
    },
    {
      title: 'Active Rentals',
      value: '425',
      change: '8.3% vs last week',
      progress: 50,
      color: 'green'
    },
    {
      title: 'Total Customers',
      value: '1000',
      change: '5.2% vs last week',
      progress: 85,
      color: 'purple'
    },
    {
      title: 'Avg. Rental Time',
      value: '5.4 hrs',
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
        <div key={index} className="p-6 transition-colors duration-300 bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
              <h3 className="mt-1 text-2xl font-bold dark:text-white">{stat.value}</h3>
            </div>
            <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-medium px-2 py-0.5 rounded-full flex items-center">
              <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
              {stat.change}
            </span>
          </div>
          <div className="h-2 mt-4 bg-gray-200 rounded-full dark:bg-gray-700">
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