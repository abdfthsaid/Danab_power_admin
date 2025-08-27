import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faUsers, faCalendarDay, faMoneyBillWave, faCalendar } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
import { apiService } from '../api/apiConfig'

const StatsCards = () => {
  const [monthlyData, setMonthlyData] = useState({ month: '', totalCustomersThisMonth: 0, stations: 0 })
  const [dailyData, setDailyData] = useState({ date: '', totalCustomersToday: 0, stations: 0 })
  const [revenueData, setRevenueData] = useState({ totalRevenueMonthly: 0, totalRentalsThisMonth: 0, month: '' })
  const [dailyRevenueData, setDailyRevenueData] = useState({ totalRevenueToday: 0, totalRentalsToday: 0, date: '' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch monthly revenue
        const revenueResponse = await apiService.getAllMonthlyRevenue()
        const revenueResult = revenueResponse.data
        setRevenueData(revenueResult)
        // Fetch daily revenue
        const dailyRevenueResponse = await apiService.getAllDailyRevenue()
        const dailyRevenueResult = dailyRevenueResponse.data
        setDailyRevenueData(dailyRevenueResult)
        // Fetch monthly data
        const monthlyResponse = await apiService.getMonthlyTotalCustomers()
        const monthlyResult = monthlyResponse.data
        setMonthlyData(monthlyResult)
        // Fetch daily data
        const dailyResponse = await apiService.getDailyTotalCustomers()
        const dailyResult = dailyResponse.data
        setDailyData(dailyResult)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }

    fetchData()
  }, [])

  const stats = [
    {
      title: `Total Revenue (${revenueData.month || 'Month'})`,
      value: `$${revenueData.totalRevenueMonthly.toFixed(2)}`,
      change: `${monthlyData.totalCustomersThisMonth}  customers`,
      progress: 85,
      color: 'blue',
      icon: <FontAwesomeIcon icon={faMoneyBillWave} className="text-blue-500" />
    },
    {
      title: `Total Customers (${monthlyData.month || 'Month'})`,
      value: monthlyData.totalCustomersThisMonth.toString(),
      change: `${revenueData.totalRevenueMonthly}  revenue`,
      progress: 78,
      color: 'green',
      icon: <FontAwesomeIcon icon={faUsers} className="text-green-500" />
    },
    {
      title: `Total Revenue (Today)`,
      value: `$${dailyRevenueData.totalRevenueToday.toFixed(2)}`,
      change: `${dailyRevenueData.totalRentalsToday} customers`,
      progress: 60,
      color: 'indigo',
      icon: <FontAwesomeIcon icon={faCalendar} className="text-indigo-500" />
    },
    {
      title: `Total Customers (Today)`,
      value: dailyData.totalCustomersToday.toString(),
      change: `${dailyRevenueData.totalRevenueToday}  revenue`,
      progress: 40,
      color: 'pink',
      icon: <FontAwesomeIcon icon={faCalendarDay} className="text-pink-500" />
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      yellow: 'bg-yellow-500',
      indigo: 'bg-indigo-500',
      pink: 'bg-pink-500'
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
              {stat.icon && <span className="mr-1">{stat.icon}</span>}
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
