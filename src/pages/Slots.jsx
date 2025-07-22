import { useState, useEffect } from 'react';
import {
  FaMapMarkerAlt, FaSearch, FaTimes, FaCheckCircle, FaExclamationTriangle,
  FaPlug, FaLock, FaBatteryFull, FaUnlockAlt, FaPhoneAlt, FaClock
} from 'react-icons/fa';

// 📌 Utility function to convert a timestamp to human-readable "time ago"
function getTimeSince(timestampSeconds) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestampSeconds;
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;
  return `${hours}h ${minutes}m ${seconds}s ago`;
}

// 📊 Generic card component for displaying statistics
function StatCard({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center p-3 text-center border border-gray-100 rounded-lg shadow bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 dark:border-gray-700">
      <div className="mb-1">{icon}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
      <div className="text-xl font-bold dark:text-white">{value}</div>
    </div>
  );
}

// 🔋 Determine battery color based on level percentage
function getBatteryColor(battery) {
  if (battery >= 70) return 'bg-green-400';
  if (battery >= 40) return 'bg-yellow-400';
  return 'bg-red-500';
}

// 🔌 SlotCard: displays info about a single power bank slot
function SlotCard({ slot }) {
  const status = slot.rented ? 'Occupied' : 'Available';
  const isOccupied = slot.rented;

  // 🔓 Button to lock/unlock slot based on status
  const actionBtn = isOccupied ? (
    <button className="flex items-center justify-center w-full gap-2 py-2 mt-1 font-semibold text-white transition bg-red-600 border border-red-600 rounded-lg dark:bg-red-700 dark:border-red-700 hover:bg-red-700 dark:hover:bg-red-800">
      <FaUnlockAlt className="mr-1" /> Unlock
    </button>
  ) : (
    <button className="flex items-center justify-center w-full gap-2 py-2 mt-1 font-semibold text-gray-700 transition bg-gray-200 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-900">
      <FaLock className="mr-1" /> Lock
    </button>
  );

  // 🟢 Define card badge styles based on occupancy
  const style = isOccupied
    ? { color: 'bg-green-100 text-green-700 border-green-300', icon: <FaCheckCircle className="mr-1 text-green-500" />, label: 'Occupied' }
    : { color: 'bg-gray-100 text-gray-700 border-gray-300', icon: <FaPlug className="mr-1 text-blue-500" />, label: 'Available' };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 border border-gray-100 dark:border-gray-800 flex flex-col justify-between min-h-[220px] transition-transform hover:-translate-y-1 hover:shadow-lg duration-200">
      <div className="flex items-center justify-between mb-2">
        <div className="text-lg font-bold dark:text-white">#{slot.slot_id}</div>
        <div className={`flex items-center text-xs px-2 py-1 rounded-full font-semibold ${style.color}`}>{style.icon}{style.label}</div>
      </div>

      {/* Battery Info */}
      <div className="flex items-center mb-1">
        <FaBatteryFull className="mr-1 text-gray-400" />
        <span className="text-sm font-medium dark:text-white">Battery ID</span>
        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{slot.battery_id}</span>
      </div>

      {/* Battery Level Bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">Battery Level</span>
          <span className="text-xs font-semibold dark:text-white">{slot.level}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700">
          <div
            className={`h-2 rounded-full ${getBatteryColor(slot.level)}`}
            style={{ width: `${slot.level}%` }}
          ></div>
        </div>
      </div>

      {/* Status Info */}
      <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">
        Status: {status}
        {slot.rented && slot.phoneNumber && (
          <>
            <span className="block text-xs text-blue-600 dark:text-blue-400">
              Phone: {slot.phoneNumber}
            </span>
            {slot.rentedAt?._seconds && (
              <span className="block text-xs text-green-600 dark:text-green-400">
                Rented: {getTimeSince(slot.rentedAt._seconds)}
              </span>
            )}
          </>
        )}
      </div>

      {/* Lock/Unlock Button */}
      {actionBtn}
    </div>
  );
}

// 🚀 Main Component: Slots Dashboard
const Slots = () => {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState('');
  const [slots, setSlots] = useState([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stationStats, setStationStats] = useState({
    totalSlots: 0,
    availableCount: 0,
    rentedCount: 0
  });

  // 🛰️ Fetch station list on component mount
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch('https://danabbackend.onrender.com/api/stations/basic');
        const data = await response.json();
        setStations(data.stations || []);
        if (data.stations?.length > 0) {
          setSelectedStation(data.stations[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch stations:', error);
        setError('Failed to load stations');
      }
    };
    fetchStations();
  }, []);

  // 🔄 Fetch slot data whenever station selection changes
  useEffect(() => {
    if (!selectedStation) return;
    const fetchSlots = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`https://danabbackend.onrender.com/api/stations/stats/${selectedStation}`);
        const data = await res.json();
        setSlots(Array.isArray(data.batteries) ? data.batteries : []);
        setStationStats({
          totalSlots: data.totalSlots || 0,
          availableCount: data.availableCount || 0,
          rentedCount: data.rentedCount || 0
        });
      } catch (err) {
        setError('Failed to load slots');
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [selectedStation]);

  // 🔍 Filter slots based on search
  const filteredSlots = slots.filter(
    (slot) =>
      search === '' ||
      slot.slot_id.toString().includes(search) ||
      slot.battery_id?.toLowerCase().includes(search.toLowerCase()) ||
      slot.status?.toLowerCase().includes(search.toLowerCase())
  );

  // 📊 Stats shown in summary cards
  const slotStats = [
    { label: 'Total Slots', value: stationStats.totalSlots || slots.length, icon: <FaPlug className="text-blue-500" /> },
    { label: 'Available', value: stationStats.availableCount || slots.filter(s => !s.rented).length, icon: <FaCheckCircle className="text-green-500" /> },
    { label: 'Occupied', value: stationStats.rentedCount || slots.filter(s => s.rented).length, icon: <FaLock className="text-purple-500" /> },
    { label: 'Error', value: slots.filter(s => s.status !== 'Online').length, icon: <FaExclamationTriangle className="text-red-500" /> },
  ];

  return (
    <div className="max-w-3xl p-4 mx-auto">
      {/* Title & Description */}
      <div className="mb-4">
        <h3 className="text-2xl font-bold dark:text-white">Slot Management</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Manage power bank slots at{' '}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {stations.find(s => s.id === selectedStation)?.location || '...'}
          </span>
        </p>
      </div>

      {/* Station Selector & Search */}
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center">
        <div className="flex items-center w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 sm:w-auto">
          <FaMapMarkerAlt className="mr-2 text-blue-500" />
          <select
            className="w-full bg-transparent outline-none"
            value={selectedStation || ''}
            onChange={e => setSelectedStation(e.target.value)}
          >
            {stations.map(station => (
              <option key={station.id} value={station.id}>
                {station.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Field */}
        <div className="relative flex-1">
          <FaSearch className="absolute text-gray-400 left-3 top-3" />
          <input
            type="text"
            placeholder="Search slot or battery..."
            className="w-full py-2 pl-10 pr-10 border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="absolute text-gray-400 right-3 top-2 hover:text-red-500"
              onClick={() => setSearch('')}
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Slot Stats Summary */}
      <div className="grid grid-cols-2 gap-2 mb-4 sm:grid-cols-4">
        {slotStats.map(stat => (
          <StatCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} />
        ))}
      </div>

      {/* Grid/List Toggle */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold dark:text-white">Slot Status</span>
        <div className="flex p-1 space-x-2 bg-gray-100 rounded-lg dark:bg-gray-800">
          <button
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${view === 'grid' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}
            onClick={() => setView('grid')}
          >
            Grid View
          </button>
          <button
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${view === 'list' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}
            onClick={() => setView('list')}
          >
            List View
          </button>
        </div>
      </div>

      {/* Render Content */}
      {loading ? (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">Loading...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-600 dark:text-red-400">{error}</div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filteredSlots.map(slot => (
            <SlotCard key={slot.slot_id} slot={slot} />
          ))}
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredSlots.map(slot => (
            <div key={slot.slot_id} className="flex items-center justify-between py-3">
              <div>
                <div className="font-bold dark:text-white">#{slot.slot_id}</div>
                <div className="text-xs text-gray-400">Battery {slot.battery_id}</div>
                <div className="text-xs text-gray-400">Battery: {slot.level}%</div>

                {/* Inline Slot Info Badges */}
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center gap-2 px-3 py-1 text-yellow-800 bg-yellow-100 rounded-md dark:bg-yellow-800 dark:text-yellow-100">
                    <FaLock className="text-sm" />
                    <span><strong>Status:</strong> {slot.rented ? 'Occupied' : 'Available'}</span>
                  </div>
                  {slot.phoneNumber && (
                    <div className="flex items-center gap-2 px-3 py-1 font-bold text-blue-800 bg-blue-100 rounded-md dark:bg-blue-800 dark:text-blue-100">
                      <FaPhoneAlt className="text-sm" />
                      <span><strong>Phone:</strong> {slot.phoneNumber}</span>
                    </div>
                  )}
                  {slot.rentedAt?._seconds && (
                    <div className="flex items-center gap-2 px-3 py-1 text-green-800 bg-green-100 rounded-md dark:bg-green-800 dark:text-green-100">
                      <FaClock className="text-sm" />
                      <span><strong>Rented:</strong> {getTimeSince(slot.rentedAt._seconds)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Lock/Unlock Button */}
              {slot.rented ? (
                <button className="flex items-center gap-2 px-3 py-1 text-sm font-semibold text-white transition bg-red-600 border border-red-600 rounded-lg dark:bg-red-700 dark:border-red-700 hover:bg-red-700 dark:hover:bg-red-800">
                  <FaUnlockAlt className="mr-1" /> Unlock
                </button>
              ) : (
                <button className="flex items-center gap-2 px-3 py-1 text-sm font-semibold text-gray-700 transition bg-gray-200 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-900">
                  <FaLock className="mr-1" /> Lock
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Slots;
