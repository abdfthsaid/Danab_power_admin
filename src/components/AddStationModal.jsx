import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTimes, 
  faStore, 
  faMapMarkerAlt, 
  faBatteryThreeQuarters,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'

const AddStationModal = ({ isOpen, onClose, onAddStation }) => {
  const [formData, setFormData] = useState({
    st_id: '',
    dt_name: '',
    location: '',
    coordinates: {
      latitude: '',
      longitude: ''
    },
    totalSlots: '',
    availableSlots: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'latitude' || name === 'longitude') {
      setFormData(prev => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [name]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.st_id.trim()) {
      newErrors.st_id = 'Station ID is required'
    }
    
    if (!formData.dt_name.trim()) {
      newErrors.dt_name = 'Station name is required'
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }
    
    if (!formData.coordinates.latitude || !formData.coordinates.longitude) {
      newErrors.coordinates = 'Coordinates are required'
    }
    
    if (!formData.totalSlots || formData.totalSlots < 1) {
      newErrors.totalSlots = 'Total slots must be at least 1'
    }
    
    if (!formData.availableSlots || formData.availableSlots < 0) {
      newErrors.availableSlots = 'Available slots cannot be negative'
    }
    
    if (parseInt(formData.availableSlots) > parseInt(formData.totalSlots)) {
      newErrors.availableSlots = 'Available slots cannot exceed total slots'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (onAddStation) {
        onAddStation({
          ...formData,
          id: Date.now().toString(),
          status: 'Active',
          createdAt: new Date().toISOString()
        })
      }
      
      // Reset form
      setFormData({
        st_id: '',
        dt_name: '',
        location: '',
        coordinates: {
          latitude: '',
          longitude: ''
        },
        totalSlots: '',
        availableSlots: ''
      })
      onClose()
    } catch (error) {
      console.error('Error adding station:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FontAwesomeIcon icon={faStore} className="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Station</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Create a new power bank rental station</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Station ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Station ID *
              </label>
              <input
                type="text"
                name="st_id"
                value={formData.st_id}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.st_id ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., WSEP161741066502"
              />
              {errors.st_id && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.st_id}</p>
              )}
            </div>

            {/* Station Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Station Name *
              </label>
              <input
                type="text"
                name="dt_name"
                value={formData.dt_name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.dt_name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Cafe Castello Boondheere"
              />
              {errors.dt_name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.dt_name}</p>
              )}
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-400" />
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.location ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Boondheere, Mogadishu, Somalia"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location}</p>
              )}
            </div>

            {/* Coordinates */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Latitude *
              </label>
              <input
                type="number"
                step="any"
                name="latitude"
                value={formData.coordinates.latitude}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.coordinates ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 2.0469"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Longitude *
              </label>
              <input
                type="number"
                step="any"
                name="longitude"
                value={formData.coordinates.longitude}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.coordinates ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 45.3181"
              />
              {errors.coordinates && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.coordinates}</p>
              )}
            </div>

            {/* Total Slots */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FontAwesomeIcon icon={faBatteryThreeQuarters} className="mr-2 text-gray-400" />
                Total Slots *
              </label>
              <input
                type="number"
                name="totalSlots"
                value={formData.totalSlots}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.totalSlots ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 6"
              />
              {errors.totalSlots && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.totalSlots}</p>
              )}
            </div>

            {/* Available Slots */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Available Slots *
              </label>
              <input
                type="number"
                name="availableSlots"
                value={formData.availableSlots}
                onChange={handleInputChange}
                min="0"
                max={formData.totalSlots}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.availableSlots ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 4"
              />
              {errors.availableSlots && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.availableSlots}</p>
              )}
            </div>
          </div>

          {/* Preview Card */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Station Preview</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">ID</p>
                <p className="font-medium dark:text-white">{formData.st_id || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Name</p>
                <p className="font-medium dark:text-white">{formData.dt_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Total Slots</p>
                <p className="font-medium dark:text-white">{formData.totalSlots || '0'}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Available</p>
                <p className="font-medium dark:text-white">{formData.availableSlots || '0'}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faStore} />
                  <span>Add Station</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddStationModal 