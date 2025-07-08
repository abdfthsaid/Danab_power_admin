const Transactions = ({ showAll = false, onViewAll }) => {
  const transactions = [
    {
      id: '53866395',
      status: 'Overdue',
      amount: '$0.50',
      time: 'Yesterday, 6:47 PM',
      customer: '+(252) 618-519075',
      powerBank: 'WSKC54170001',
      station: 'Java Taleex Branch',
      statusColor: 'red'
    },
    {
      id: '53865735',
      status: 'Completed',
      amount: '$0.50',
      time: 'Yesterday, 6:36 PM',
      customer: '+(252) 612-536363',
      powerBank: 'WSKC54170020',
      station: 'Java Taleex Branch',
      statusColor: 'green'
    },
    {
      id: '53865529',
      status: 'Completed',
      amount: '$0.50',
      time: 'Yesterday, 6:31 PM',
      customer: '+(252) 613-707263',
      powerBank: 'WSKC54170012',
      station: 'Cafe castello',
      statusColor: 'green'
    },
    // Add more demo transactions for 'View All'
    {
      id: '53865400',
      status: 'Completed',
      amount: '$0.50',
      time: 'Yesterday, 6:20 PM',
      customer: '+(252) 614-123456',
      powerBank: 'WSKC54170030',
      station: 'Jazeera Hotel',
      statusColor: 'green'
    },
    {
      id: '53865300',
      status: 'Overdue',
      amount: '$0.50',
      time: 'Yesterday, 6:10 PM',
      customer: '+(252) 615-654321',
      powerBank: 'WSKC54170040',
      station: 'Mogadishu Mall',
      statusColor: 'red'
    },
  ];

  const getStatusClasses = (color) => {
    const colors = {
      red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    }
    return colors[color] || 'bg-gray-100 text-gray-800'
  }

  const getStatusTextColor = (color) => {
    const colors = {
      red: 'text-red-600 dark:text-red-400',
      green: 'text-green-600 dark:text-green-400'
    }
    return colors[color] || 'text-gray-600'
  }

  const visibleTransactions = showAll ? transactions : transactions.slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow dark:bg-gray-800 transition-colors duration-300">
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg dark:text-white">Recent Transactions</h3>
          {!showAll && (
            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium" onClick={onViewAll}>View All</button>
          )}
        </div>
      </div>
      <div className="divide-y dark:divide-gray-700">
        {visibleTransactions.map((transaction) => (
          <div key={transaction.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium dark:text-white">ID: {transaction.id}</p>
                <div className="flex items-center mt-1">
                  <span className={`${getStatusClasses(transaction.statusColor)} text-xs font-medium px-2 py-0.5 rounded-full`}>
                    {transaction.status}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">{transaction.time}</span>
                </div>
              </div>
              <span className="font-bold dark:text-white">{transaction.amount}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Customer</p>
                <p className="font-medium dark:text-white">{transaction.customer}</p>
                <p className="text-sm dark:text-gray-300">Power Bank {transaction.powerBank}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Station</p>
                <p className="font-medium dark:text-white">{transaction.station}</p>
                <p className="text-sm">Status: <span className={getStatusTextColor(transaction.statusColor)}>{transaction.status}</span></p>
              </div>
            </div>
            <div className="mt-3 text-right">
              <button className="text-blue-600 dark:text-blue-400 text-sm font-medium">View Details →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Transactions 