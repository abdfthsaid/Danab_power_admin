const Slots = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold dark:text-white">Slot Management</h3>
          <p className="text-gray-500 dark:text-gray-400">Manage power bank slots across all stations</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200">
            Refresh Status
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors duration-200">
            Add Slots
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow dark:bg-gray-800 transition-colors duration-300">
        <div className="p-4">
          <h3 className="font-semibold text-lg dark:text-white mb-4">Slot Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Total Slots</p>
                  <h4 className="text-2xl font-bold dark:text-white">24</h4>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Available Slots</p>
                  <h4 className="text-2xl font-bold dark:text-white">18</h4>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Occupied Slots</p>
                  <h4 className="text-2xl font-bold dark:text-white">6</h4>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Slot management interface coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Slots 