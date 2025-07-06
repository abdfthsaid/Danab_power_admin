import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faStore, faCheckCircle, faExclamationTriangle, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'

const Stations = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', location: '', status: 'Active' });
  const [success, setSuccess] = useState(false);
  const stations = [
    { id: 'WSEP161741066502', name: 'Cafe castello Boondheere', location: 'Boonc', status: 'Active' },
    { id: 'WSEP161741066505', name: 'Cafe Castello Cali K Cali Kamlin', location: 'Cali Kamlin', status: 'Active' },
    { id: 'WSEP161721195358', name: 'Cafe castello Taleex', location: 'Talee', status: 'Active' },
    { id: 'WSEP161741066503', name: 'Java Taleex', location: 'Talee', status: 'Active' }
  ];

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setModalOpen(false);
      setForm({ name: '', location: '', status: 'Active' });
    }, 1500);
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-fadeInUp">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 dark:hover:text-white text-xl focus:outline-none"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 text-blue-600 rounded-full p-3 mr-3">
                <FontAwesomeIcon icon={faStore} className="text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Station</h2>
            </div>
            {success ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="bg-green-100 text-green-600 rounded-full p-4 mb-4">
                  <FontAwesomeIcon icon={faCheck} className="text-3xl" />
                </div>
                <p className="text-lg font-semibold text-green-700 dark:text-green-400">Station created successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-gray-700 dark:text-gray-200 mb-1 font-medium">Station Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white transition-all"
                    placeholder="Enter station name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-200 mb-1 font-medium">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white transition-all"
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-200 mb-1 font-medium">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white transition-all"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Create Station
                </button>
              </form>
            )}
          </div>
        </div>
      )}

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Total Stations</p>
                  <h4 className="text-2xl font-bold dark:text-white">4</h4>
                </div>
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                  <FontAwesomeIcon icon={faStore} />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Active Stations</p>
                  <h4 className="text-2xl font-bold dark:text-white">4</h4>
                </div>
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
                  <FontAwesomeIcon icon={faCheckCircle} />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Needs Maintenance</p>
                  <h4 className="text-2xl font-bold dark:text-white">0</h4>
                </div>
                <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400">
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Station ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {stations.map((station) => (
                  <tr key={station.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">{station.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{station.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{station.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-0.5 rounded-full text-xs">
                        {station.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stations 