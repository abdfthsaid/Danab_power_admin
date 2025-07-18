import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import CustomAlert from '../alerts/CustomAlert';
import { useAuth } from '../context/AuthContext';

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
  const [infoModal, setInfoModal] = useState({ open: false, station: null });
  const [stationStats, setStationStats] = useState({ loading: false, error: '', daily: null, monthly: null });
  const { user: currentUser } = useAuth();

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

  // Update openInfoModal to use new revenue APIs and fields
  const openInfoModal = async (station) => {
    setInfoModal({ open: true, station });
    setStationStats({ loading: true, error: '', daily: null, monthly: null });
    try {
      const [dailyRes, monthlyRes] = await Promise.all([
        axios.get(`https://danabbackend.onrender.com/api/revenue/daily/${station.imei}`),
        axios.get(`https://danabbackend.onrender.com/api/revenue/monthly/${station.imei}`)
      ]);
      setStationStats({
        loading: false,
        error: '',
        daily: dailyRes.data,
        monthly: monthlyRes.data
      });
    } catch (error) {
      setStationStats({ loading: false, error: 'Failed to fetch stats', daily: null, monthly: null });
    }
  };
  const closeInfoModal = () => {
    setInfoModal({ open: false, station: null });
    setStationStats({ loading: false, error: '', daily: null, monthly: null });
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
      <div className="flex flex-col mb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-2xl font-bold dark:text-white">Station Management</h3>
          <p className="text-gray-500 dark:text-gray-400">Manage all power bank rental stations</p>
        </div>
        <button
          className="flex items-center px-5 py-2 mt-4 font-semibold text-white transition-all duration-200 rounded-lg shadow-lg md:mt-0 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={openAddModal}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add New Station
        </button>
      </div>
      {/* Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg p-8 bg-white shadow-2xl dark:bg-gray-800 rounded-2xl animate-fadeInUp">
            <button
              className="absolute text-xl text-gray-400 top-4 right-4 hover:text-blue-600 dark:hover:text-white focus:outline-none"
              onClick={closeModal}
              aria-label="Close"
            >
              &times;
            </button>
            <h4 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Add Station</h4>
            <form onSubmit={handleAdd} className="space-y-5">
              <div>
                <label htmlFor="imei" className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">IMEI</label>
                <input type="text" id="imei" className="w-full px-4 py-2 transition-all border border-gray-200 rounded-lg dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white" placeholder="IMEI" value={form.imei} onChange={e => setForm({ ...form, imei: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Name</label>
                <input type="text" id="name" className="w-full px-4 py-2 transition-all border border-gray-200 rounded-lg dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="iccid" className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">ICCID</label>
                <input type="text" id="iccid" className="w-full px-4 py-2 transition-all border border-gray-200 rounded-lg dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white" placeholder="ICCID" value={form.iccid} onChange={e => setForm({ ...form, iccid: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="location" className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Location</label>
                <input type="text" id="location" className="w-full px-4 py-2 transition-all border border-gray-200 rounded-lg dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white" placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="totalSlots" className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Total Slots</label>
                <input type="number" id="totalSlots" className="w-full px-4 py-2 transition-all border border-gray-200 rounded-lg dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white" placeholder="Total Slots" value={form.totalSlots} onChange={e => setForm({ ...form, totalSlots: e.target.value })} required min={1} />
              </div>
              <div className="flex justify-end mt-6 space-x-3">
                <button type="button" className="px-5 py-2 text-gray-700 transition bg-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500" onClick={closeModal}>Cancel</button>
                <button type="submit" className="px-5 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg p-8 bg-white shadow-2xl dark:bg-gray-800 rounded-2xl animate-fadeInUp">
            <button
              className="absolute text-xl text-gray-400 top-4 right-4 hover:text-blue-600 dark:hover:text-white focus:outline-none"
              onClick={closeModal}
              aria-label="Close"
            >
              &times;
            </button>
            <h4 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Edit Station</h4>
            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label htmlFor="editImei" className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">IMEI</label>
                <input type="text" id="editImei" className="w-full px-4 py-2 transition-all border border-gray-200 rounded-lg dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white" placeholder="IMEI" value={form.imei}   onChange={e => setForm({ ...form, imei: e.target.value })}   required />
              </div>
              <div>
                <label htmlFor="editName" className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Name</label>
                <input type="text" id="editName" className="w-full px-4 py-2 transition-all border border-gray-200 rounded-lg dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="editIccid" className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">ICCID</label>
                <input type="text" id="editIccid" className="w-full px-4 py-2 transition-all border border-gray-200 rounded-lg dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white" placeholder="ICCID" value={form.iccid} onChange={e => setForm({ ...form, iccid: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="editLocation" className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Location</label>
                <input type="text" id="editLocation" className="w-full px-4 py-2 transition-all border border-gray-200 rounded-lg dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white" placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="editTotalSlots" className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Total Slots</label>
                <input type="number" id="editTotalSlots" className="w-full px-4 py-2 transition-all border border-gray-200 rounded-lg dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white" placeholder="Total Slots" value={form.totalSlots} onChange={e => setForm({ ...form, totalSlots: e.target.value })} required min={1} />
              </div>
              <div className="flex justify-end mt-6 space-x-3">
                <button type="button" className="px-5 py-2 text-gray-700 transition bg-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500" onClick={closeModal}>Cancel</button>
                <button type="submit" className="px-5 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {confirmDelete.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative w-full max-w-md p-8 bg-white shadow-2xl dark:bg-gray-800 rounded-2xl animate-fadeInUp">
            <button
              className="absolute text-xl text-gray-400 top-4 right-4 hover:text-blue-600 dark:hover:text-white focus:outline-none"
              onClick={() => setConfirmDelete({ open: false, station: null })}
              aria-label="Close"
            >
              &times;
            </button>
            <h4 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Are you sure you want to delete this station?</h4>
            <div className="flex justify-end mt-6 space-x-3">
              <button className="px-5 py-2 text-gray-700 transition bg-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500" onClick={() => setConfirmDelete({ open: false, station: null })}>Cancel</button>
              <button className="px-5 py-2 text-white transition bg-red-600 rounded-lg hover:bg-red-700" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
      {infoModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative w-full max-w-md p-8 bg-white shadow-2xl dark:bg-gray-800 rounded-2xl animate-fadeInUp">
            <button
              className="absolute text-xl text-gray-400 top-4 right-4 hover:text-indigo-600 dark:hover:text-white focus:outline-none"
              onClick={closeInfoModal}
              aria-label="Close"
            >
              &times;
            </button>
            <h4 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">Station Stats</h4>
            <div className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-200">{infoModal.station?.name}</div>
            <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">IMEI: {infoModal.station?.imei}</div>
            {stationStats.loading ? (
              <div className="py-6 text-center text-gray-500 dark:text-gray-400">Loading...</div>
            ) : stationStats.error ? (
              <div className="py-6 text-center text-red-600 dark:text-red-400">{stationStats.error}</div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-semibold text-base flex-1 text-center shadow">
                    Today's Revenue
                    <span className="block text-2xl font-bold mt-1">${stationStats.daily?.totalRevenueToday?.toFixed(2) ?? '-'}</span>
                    <span className="block text-xs mt-1">{stationStats.daily?.totalRentalsToday ?? '-'} rentals</span>
                  </span>
                  <span className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-semibold text-base flex-1 text-center shadow">
                    Monthly Revenue
                    <span className="block text-2xl font-bold mt-1">${stationStats.monthly?.totalRevenueMonthly?.toFixed(2) ?? '-'}</span>
                    <span className="block text-xs mt-1">{stationStats.monthly?.totalRentalsThisMonth ?? '-'} rentals</span>
                  </span>
                </div>
              </div>
            )}
            <div className="flex justify-end mt-6">
              <button className="px-5 py-2 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700" onClick={closeInfoModal}>Close</button>
            </div>
          </div>
        </div>
      )}
      <div className="mb-6 transition-colors duration-300 bg-white rounded-lg shadow dark:bg-gray-800">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="relative w-full mb-4 md:w-64 md:mb-0">
              <input
                type="text"
                placeholder="Search stations..."
                value={search}
                onChange={handleSearch}
                className="w-full py-2 pl-8 pr-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              />
              <span className="absolute text-gray-400 left-2 top-3">
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
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">IMEI</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Name</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">ICCID</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Location</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Total Slots</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {filteredStations.map((station) => (
                  <tr key={station.imei}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-gray-300">{station.imei}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-gray-300">{station.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-gray-300">{station.iccid}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-gray-300">{station.location}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-gray-300">{station.totalSlots}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-gray-300 flex gap-2">
                      <button
                        className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 transition shadow"
                        onClick={() => openEditModal(station)}
                        title="Edit"
                      >
                        <FontAwesomeIcon icon={faPen} className="text-blue-600 text-lg" />
                      </button>
                      {currentUser?.role === 'admin' && (
                        <button
                          className="p-2 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 transition shadow"
                          onClick={() => setConfirmDelete({ open: true, station })}
                          title="Delete"
                        >
                          <FontAwesomeIcon icon={faTrash} className="text-red-600 text-lg" />
                        </button>
                      )}
                      <button
                        className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 transition shadow"
                        onClick={() => openInfoModal(station)}
                        title="View Stats"
                      >
                        <FontAwesomeIcon icon={faInfoCircle} className="text-indigo-600 text-lg" />
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