import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import CustomAlert from '../alerts/CustomAlert';

const Stations = () => {
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [form, setForm] = useState({ imei: '', name: '', iccid: '', location: '', totalSlots: '' });
  const [search, setSearch] = useState('');
  const [alert, setAlert] = useState({ open: false, message: '', type: '' });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, station: null });
  const [editId, setEditId] = useState(null);

  // Show custom alert
  const showAlert = (message, type) => {
    setAlert({ open: true, message, type });
    setTimeout(() => setAlert({ open: false, message: '', type: '' }), 2000);
  };

  // Fetch all stations
  const fetchStations = async () => {
    const response = await axios.get('https://danabbackend.onrender.com/api/stations/basic');
    setStations(response.data.stations || []);
    setFilteredStations(response.data.stations || []);
  };

  useEffect(() => {
    fetchStations();
  }, []);

  // Open modal for add
  const openAddModal = () => {
    setForm({ imei: '', name: '', iccid: '', location: '', totalSlots: '' });
    setSelectedStation(null);
    setModalOpen(true);
  };

  // Open modal for edit
  const openEditModal = (station) => {
    setForm({
      imei: station.imei,
      name: station.name,
      iccid: station.iccid,
      location: station.location,
      totalSlots: station.totalSlots
    });
    setSelectedStation(station);
    setEditId(station.id); // store id for update
    setEditModalOpen(true);
  };

  // Close modals
  const closeModal = () => {
    setModalOpen(false);
    setEditModalOpen(false);
  };

  // Add new station
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://danabbackend.onrender.com/api/stations/add', {
        imei: form.imei,
        name: form.name,
        iccid: form.iccid,
        location: form.location,
        totalSlots: Number(form.totalSlots)
      });
      showAlert('Station registered successfully!', 'success');
      setTimeout(() => {
        closeModal();
        fetchStations();
      }, 1000);
    } catch (error) {
      showAlert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          'Something went wrong!',
        'error'
      );
    }
  };

  // Update station
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://danabbackend.onrender.com/api/stations/update/${editId}`,
        {
          imei: form.imei,
          name: form.name,
          iccid: form.iccid,
          location: form.location,
          totalSlots: Number(form.totalSlots)
        }
      );
      showAlert('Station updated successfully!', 'success');
      setTimeout(() => {
        closeModal();
        fetchStations();
      }, 1000);
    } catch (error) {
      showAlert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          'Something went wrong!',
        'error'
      );
    }
  };

  // Handle search input change
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearch(term);
    const filtered = stations.filter(
      (station) =>
        station.imei.toLowerCase().includes(term.toLowerCase()) ||
        station.name.toLowerCase().includes(term.toLowerCase()) ||
        station.iccid.toLowerCase().includes(term.toLowerCase()) ||
        station.location.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredStations(filtered);
  };

  const handleDelete = async () => {
    if (!confirmDelete.station) return;
    try {
      await axios.delete(`https://danabbackend.onrender.com/api/stations/delete/${confirmDelete.station.imei}`);
      showAlert('Station deleted successfully!', 'error');
      setTimeout(() => {
        setConfirmDelete({ open: false, station: null });
        fetchStations();
      }, 1000);
    } catch (error) {
      showAlert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          'Something went wrong!',
        'error'
      );
    }
  };

  return (
    <div className="p-4">
      {alert.open && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ open: false, message: '', type: '' })}
        />
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold dark:text-white">Station Management</h3>
          <p className="text-gray-500 dark:text-gray-400">Manage all power bank rental stations</p>
        </div>
        <button
          className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white py-2 px-5 rounded-lg shadow-lg font-semibold flex items-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={openAddModal}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add New Station
        </button>
      </div>
      {/* Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-fadeInUp">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 dark:hover:text-white text-xl focus:outline-none"
              onClick={closeModal}
              aria-label="Close"
            >
              &times;
            </button>
            <h4 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Add Station</h4>
            <form onSubmit={handleAdd} className="space-y-5">
              <div>
                <label htmlFor="imei" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">IMEI</label>
                <input type="text" id="imei" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-all" placeholder="IMEI" value={form.imei} onChange={e => setForm({ ...form, imei: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Name</label>
                <input type="text" id="name" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-all" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="iccid" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">ICCID</label>
                <input type="text" id="iccid" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-all" placeholder="ICCID" value={form.iccid} onChange={e => setForm({ ...form, iccid: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Location</label>
                <input type="text" id="location" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-all" placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="totalSlots" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Total Slots</label>
                <input type="number" id="totalSlots" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-all" placeholder="Total Slots" value={form.totalSlots} onChange={e => setForm({ ...form, totalSlots: e.target.value })} required min={1} />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" className="px-5 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition" onClick={closeModal}>Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-fadeInUp">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 dark:hover:text-white text-xl focus:outline-none"
              onClick={closeModal}
              aria-label="Close"
            >
              &times;
            </button>
            <h4 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Edit Station</h4>
            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label htmlFor="editImei" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">IMEI</label>
                <input type="text" id="editImei" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-all" placeholder="IMEI" value={form.imei}   onChange={e => setForm({ ...form, imei: e.target.value })}   required />
              </div>
              <div>
                <label htmlFor="editName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Name</label>
                <input type="text" id="editName" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-all" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="editIccid" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">ICCID</label>
                <input type="text" id="editIccid" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-all" placeholder="ICCID" value={form.iccid} onChange={e => setForm({ ...form, iccid: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="editLocation" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Location</label>
                <input type="text" id="editLocation" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-all" placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="editTotalSlots" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Total Slots</label>
                <input type="number" id="editTotalSlots" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-all" placeholder="Total Slots" value={form.totalSlots} onChange={e => setForm({ ...form, totalSlots: e.target.value })} required min={1} />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" className="px-5 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition" onClick={closeModal}>Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {confirmDelete.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fadeInUp">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 dark:hover:text-white text-xl focus:outline-none"
              onClick={() => setConfirmDelete({ open: false, station: null })}
              aria-label="Close"
            >
              &times;
            </button>
            <h4 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Are you sure you want to delete this station?</h4>
            <div className="flex justify-end space-x-3 mt-6">
              <button className="px-5 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition" onClick={() => setConfirmDelete({ open: false, station: null })}>Cancel</button>
              <button className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition" onClick={handleDelete}>Delete</button>
            </div>
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
                value={search}
                onChange={handleSearch}
                className="w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              />
              <span className="absolute left-2 top-3 text-gray-400">
                <FontAwesomeIcon icon={faPlus} />
              </span>
            </div>
          </div>
        </div>
        <div className="p-4">
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
                {filteredStations.map((station) => (
                  <tr key={station.imei}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">{station.imei}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{station.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{station.iccid}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{station.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{station.totalSlots}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      <button
                        className="inline-flex items-center px-4 py-2 mr-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onClick={() => openEditModal(station)}
                        title="Edit"
                      >
                        <FontAwesomeIcon icon={faPen} className="mr-2" /> Edit
                      </button>
                      <button
                        className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-red-400"
                        onClick={() => setConfirmDelete({ open: true, station })}
                        title="Delete"
                      >
                        <FontAwesomeIcon icon={faTrash} className="mr-2" /> Delete
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
  );
};

export default Stations; 