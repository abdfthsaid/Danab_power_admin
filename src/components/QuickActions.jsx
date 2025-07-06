import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPlus, 
  faBatteryThreeQuarters, 
  faUserPlus, 
  faFileInvoiceDollar,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'

const QuickActions = () => {
  const actions = [
    {
      title: 'Add New Station',
      icon: faPlus,
      bgColor: 'bg-blue-50 dark:bg-gray-700',
      iconBg: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-blue-600 dark:text-blue-400',
      hoverBg: 'hover:bg-blue-100 dark:hover:bg-gray-600'
    },
    {
      title: 'Check Power Bank Status',
      icon: faBatteryThreeQuarters,
      bgColor: 'bg-blue-50 dark:bg-gray-700',
      iconBg: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-blue-600 dark:text-blue-400',
      hoverBg: 'hover:bg-blue-100 dark:hover:bg-gray-600'
    },
    {
      title: 'Add New User',
      icon: faUserPlus,
      bgColor: 'bg-green-50 dark:bg-gray-700',
      iconBg: 'bg-green-100 dark:bg-green-900',
      iconColor: 'text-green-600 dark:text-green-400',
      hoverBg: 'hover:bg-green-100 dark:hover:bg-gray-600'
    },
    {
      title: 'Generate Report',
      icon: faFileInvoiceDollar,
      bgColor: 'bg-purple-50 dark:bg-gray-700',
      iconBg: 'bg-purple-100 dark:bg-purple-900',
      iconColor: 'text-purple-600 dark:text-purple-400',
      hoverBg: 'hover:bg-purple-100 dark:hover:bg-gray-600'
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow p-4 dark:bg-gray-800 transition-colors duration-300">
      <h3 className="font-semibold text-lg mb-4 dark:text-white">Quick Actions</h3>
      
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button 
            key={index}
            className={`w-full flex items-center justify-between p-3 ${action.bgColor} ${action.hoverBg} rounded-lg transition-colors duration-200`}
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${action.iconBg} ${action.iconColor} mr-3`}>
                <FontAwesomeIcon icon={action.icon} />
              </div>
              <span className="font-medium">{action.title}</span>
            </div>
            <FontAwesomeIcon icon={faChevronRight} className="text-gray-400" />
          </button>
        ))}
      </div>
      
      {/* Recent Transactions (Mini) */}
      <div className="mt-6">
        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Transaction</h4>
        <div className="border rounded-md p-3 dark:border-gray-700">
          <div className="flex justify-between">
            <div>
              <p className="font-medium dark:text-white">ID: 53876983</p>
              <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs font-medium px-2 py-0.5 rounded-full">Overdue</span>
            </div>
            <span className="font-bold dark:text-white">$0.50</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Yesterday, 9:30 PM</p>
        </div>
      </div>
    </div>
  )
}

export default QuickActions 