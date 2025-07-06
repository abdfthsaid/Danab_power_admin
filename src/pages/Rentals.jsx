const Rentals = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold dark:text-white">Active Rentals</h3>
          <p className="text-gray-500 dark:text-gray-400">Monitor and manage active power bank rentals</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow dark:bg-gray-800 transition-colors duration-300">
        <div className="p-4">
          <h3 className="font-semibold text-lg dark:text-white mb-4">Rental Overview</h3>
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Active rentals interface coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Rentals 