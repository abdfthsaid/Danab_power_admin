import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faStore, faMapMarkerAlt, faSpinner } from '@fortawesome/free-solid-svg-icons'

const AddStationModal = ({ isOpen, onClose, onAddStation }) => {
  const [formData, setFormData] = useState({
    imei: '',
    name: '',
    iccid: '',
    location: '',
    totalSlots: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.imei.trim()) newErrors.imei = 'IMEI is required'
    if (!formData.name.trim()) newErrors.name = 'Station name is required'
    if (!formData.iccid.trim()) newErrors.iccid = 'ICCID is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (!formData.totalSlots || isNaN(formData.totalSlots) || Number(formData.totalSlots) < 1) newErrors.totalSlots = 'Total slots must be at least 1'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    if (!validateForm()) return
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3000/api/stations/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imei: formData.imei,
          name: formData.name,
          iccid: formData.iccid,
          location: formData.location,
          totalSlots: Number(formData.totalSlots),
        })
      })
      if (!res.ok) throw new Error('Failed to register station')
      if (onAddStation) onAddStation(formData)
      setFormData({ imei: '', name: '', iccid: '', location: '', totalSlots: '' })
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 1500)
    } catch (error) {
      setApiError(error.message || 'Error registering station')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-100/80 via-white/90 to-blue-200/80 dark:from-gray-900/90 dark:via-gray-800/95 dark:to-gray-900/90 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-blue-100 dark:border-gray-700 relative animate-fadeInUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-t-3xl">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-200 dark:bg-blue-900 rounded-xl shadow">
              <FontAwesomeIcon icon={faStore} className="text-blue-700 dark:text-blue-300 text-2xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Add New Station</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Register a new power bank rental station</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors duration-200 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Close"
          >
            <FontAwesomeIcon icon={faTimes} className="text-2xl" />
          </button>
        </div>
        {/* Form or Success */}
        {success ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full p-6 mb-4 shadow">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h4 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-2">Station registered!</h4>
            <p className="text-gray-600 dark:text-gray-300">The new station has been added successfully.</p>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            {/* IMEI */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">IMEI <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="imei"
                value={formData.imei}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm transition-all ${errors.imei ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}`}
                placeholder="e.g., WSEP161741066505"
                autoComplete="off"
              />
              {errors.imei && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.imei}</p>}
            </div>
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">Station Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm transition-all ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}`}
                placeholder="e.g., DANAB Deynile"
                autoComplete="off"
              />
              {errors.name && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name}</p>}
            </div>
            {/* ICCID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">ICCID <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="iccid"
                value={formData.iccid}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm transition-all ${errors.iccid ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}`}
                placeholder="e.g., 8925211200394875539f"
                autoComplete="off"
              />
              {errors.iccid && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.iccid}</p>}
            </div>
            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 tracking-wide"><FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-400" />Location <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm transition-all ${errors.location ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}`}
                placeholder="e.g., Mogadishu Somalia Deynile"
                autoComplete="off"
              />
              {errors.location && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.location}</p>}
            </div>
            {/* Total Slots */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">Total Slots <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="totalSlots"
                value={formData.totalSlots}
                onChange={handleInputChange}
                min={1}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm transition-all ${errors.totalSlots ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}`}
                placeholder="e.g., 8"
                autoComplete="off"
              />
              {errors.totalSlots && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.totalSlots}</p>}
            </div>
          </div>
          {apiError && <div className="text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300 rounded-xl px-4 py-2 text-center font-medium shadow">{apiError}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white py-3 px-4 rounded-xl font-bold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-60 flex items-center justify-center text-lg tracking-wide"
          >
            {loading && <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />} Register Station
          </button>
        </form>
        )}
      </div>
    </div>
  )
}

export default AddStationModal 