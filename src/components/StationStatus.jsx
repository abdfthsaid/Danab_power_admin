const StationStatus = () => {
  const stations = [
    { id: 'WSEP161741066502', name: 'Cafe castello Boondheere', location: 'Boonc', status: 'Active' },
    { id: 'WSEP161741066505', name: 'Cafe Castello Cali K Cali Kamlin', location: 'Cali Kamlin', status: 'Active' },
    { id: 'WSEP161721195358', name: 'Cafe castello Taleex', location: 'Talee', status: 'Active' },
    { id: 'WSEP161741066503', name: 'Java Taleex', location: 'Talee', status: 'Active' }
  ]

  return (
    <div className="bg-white rounded-lg shadow dark:bg-gray-800 transition-colors duration-300">
      <div className="p-4 border-b dark:border-gray-700">
        <h3 className="font-semibold text-lg dark:text-white">Station Status</h3>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-medium dark:text-white">Station Availability</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current status of all stations</p>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded-md text-sm font-medium dark:border-gray-600 dark:text-gray-300">List View</button>
            <button className="px-3 py-1 border rounded-md text-sm font-medium dark:border-gray-600 dark:text-gray-300">Map View</button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-md text-center dark:bg-gray-700">
            <p className="text-2xl font-bold dark:text-white">4</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Stations</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md text-center dark:bg-gray-700">
            <p className="text-2xl font-bold dark:text-white">4</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Active</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md text-center dark:bg-gray-700">
            <p className="text-2xl font-bold dark:text-white">0</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Inactive</p>
          </div>
        </div>
        
        <div className="border rounded-md overflow-hidden dark:border-gray-700">
          <div className="grid grid-cols-4 bg-gray-100 p-2 text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            <div>Station ID</div>
            <div>Name</div>
            <div>Location</div>
            <div>Status</div>
          </div>
          
          <div className="divide-y dark:divide-gray-700">
            {stations.map((station) => (
              <div key={station.id} className="grid grid-cols-4 p-2 text-sm dark:text-gray-300">
                <div>{station.id}</div>
                <div>{station.name}</div>
                <div>{station.location}</div>
                <div>
                  <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-0.5 rounded-full text-xs">
                    {station.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StationStatus 