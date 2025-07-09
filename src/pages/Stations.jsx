import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faStore, faCheckCircle, faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons'
import AddStationModal from '../components/AddStationModal';

const Stations = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStations = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3000/api/stations');
      if (!res.ok) throw new Error('Failed to fetch stations');
      const data = await res.json();
      setStations(Array.isArray(data.stations) ? data.stations : []);
    } catch (err) {
      setError(err.message || 'Error fetching stations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleStationAdded = () => {
    setModalOpen(false);
    fetchStations();
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold dark:text-white">Station Management</h3>
          <p className="text-gray-500 dark:text-gray-400">Manage all power bank rental stations</p>
        </div>
        <button
          className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white py-2 px-5 rounded-lg shadow-lg font-semibold flex items-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={() => setModalOpen(true)}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add New Station
        </button>
      </div>
      <AddStationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onAddStation={handleStationAdded} />
      <div className="bg-white rounded-lg shadow dark:bg-gray-800 transition-colors duration-300 mb-6">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-64 mb-4 md:mb-0">
              <input 
                type="text" 
                placeholder="Search stations..." 
                className="w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              />
              <FontAwesomeIcon icon={faStore} className="absolute left-2 top-3 text-gray-400" />
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border rounded-md text-sm font-medium dark:border-gray-600 dark:text-gray-300">List View</button>
              <button className="px-3 py-1 border rounded-md text-sm font-medium dark:border-gray-600 dark:text-gray-300">Grid View</button>
              <button className="px-3 py-1 border rounded-md text-sm font-medium dark:border-gray-600 dark:text-gray-300">Filters</button>
            </div>
          </div>
        </div>
        <div className="p-4">
          {loading ? (
            <div className="text-center text-gray-500 dark:text-gray-400">Loading stations...</div>
          ) : error ? (
            <div className="text-center text-red-600 dark:text-red-400">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">IMEI</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">ICCID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Total Slots</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {stations.map((station) => (
                    <tr key={station.imei}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">{station.imei}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{station.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{station.iccid}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{station.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{station.totalSlots}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">Edit</button>
                        <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Stations; 