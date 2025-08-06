import { useState, useEffect } from 'react';
import { apiService } from '../api/apiConfig';
import {
  FaMapMarkerAlt, FaSearch, FaTimes, FaCheckCircle, FaExclamationTriangle,
  FaPlug, FaLock, FaBatteryFull, FaUnlockAlt, FaPhoneAlt, FaClock, FaSyncAlt
} from 'react-icons/fa';

const timeAgo = (seconds) => {
  const diff = Math.floor(Date.now() / 1000) - seconds;
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  return `${h}h ${m}m ${s}s ago`;
};

const StatCard = ({ icon, label, value }) => (
  <div className="flex flex-col items-center p-3 text-center border rounded-lg shadow bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 dark:border-gray-700">
    <div>{icon}</div>
    <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
    <div className="text-xl font-bold dark:text-white">{value}</div>
  </div>
);

const getBatteryColor = (level) =>
  level >= 70 ? 'bg-green-400' : level >= 40 ? 'bg-yellow-400' : 'bg-red-500';

const getStatusInfo = (slot) => {
  const status = slot.status?.toLowerCase();
  const isMissing = status === 'empty';
  const isOverdue = status === 'overdue';
  const isOccupied = status === 'rented' || slot.rented;
  const isAvailable = status === 'online' && !slot.rented;

  let statusText = 'Unknown';
  if (isAvailable) statusText = 'Available';
  if (isOccupied) statusText = 'Occupied';
  if (isOverdue) statusText = 'Overdue';
  if (isMissing) statusText = 'Missing';

  const badgeClass = `px-2 py-1 text-xs font-semibold rounded-full border ${
    isAvailable
      ? 'text-green-700 bg-green-100 border-green-400'
      : isOccupied
      ? 'text-blue-700 bg-blue-100 border-blue-400'
      : 'text-red-700 bg-red-100 border-red-400'
  }`;

  const buttonClass = `w-full py-2 font-semibold rounded-lg flex justify-center items-center gap-2 transition ${
    isAvailable
      ? 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800'
      : isOccupied
      ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
      : 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800'
  }`;

  const borderClass = isAvailable
    ? 'border-green-400'
    : isOccupied
    ? 'border-blue-400'
    : 'border-red-400';

  const icon = isAvailable ? <FaLock /> : isOccupied ? <FaUnlockAlt /> : <FaExclamationTriangle />;

  return { statusText, badgeClass, buttonClass, borderClass, icon };
};

const SlotCard = ({ slot }) => {
  const { statusText, badgeClass, buttonClass, borderClass, icon } = getStatusInfo(slot);

  return (
    <div className={`flex flex-col justify-between p-4 rounded-xl shadow min-h-[220px] bg-white dark:bg-gray-900 border-2 ${borderClass}`}>
      <div className="flex justify-between mb-2">
        <div className="font-bold dark:text-white">#{slot.slot_id}</div>
        <div className={`flex items-center ${badgeClass}`}>
          {statusText === 'Available' && <FaCheckCircle className="text-green-500" />}
          {statusText === 'Occupied' && <FaLock className="text-blue-500" />}
          {statusText !== 'Available' && statusText !== 'Occupied' && (
            <FaExclamationTriangle className="text-red-500" />
          )}
          <span className="ml-1">{statusText}</span>
        </div>
      </div>

      <div className="flex items-center mb-1 text-sm dark:text-white">
        <FaBatteryFull className="mr-1 text-gray-400" />
        Battery ID: <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{slot.battery_id}</span>
      </div>

      <div className="mb-2">
        <div className="flex justify-between mb-1 text-xs dark:text-white">
          <span>Battery Level</span>
          <span>{slot.level !== null ? `${Math.min(Math.max(slot.level, 0), 100)}%` : 'N/A'}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
          {slot.level !== null && (
            <div
              className={`h-2 rounded-full ${getBatteryColor(slot.level)}`}
              style={{ width: `${Math.min(Math.max(slot.level, 0), 100)}%` }}
            />
          )}
        </div>
      </div>

      <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">
        Status: {statusText}
        {(statusText === 'Occupied' || statusText === 'Overdue' || statusText === 'Missing') && slot.phoneNumber && (
          <div className="mt-2 space-y-1 text-xs">
            <div className="flex items-center gap-2 px-2 py-1 text-blue-600 rounded-lg bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400">
              <FaPhoneAlt className="text-sm" />
              <span>{slot.phoneNumber}</span>
            </div>
            {slot.rentedAt?._seconds && (
              <div className="flex items-center gap-2 px-2 py-1 text-green-600 rounded-lg bg-green-50 dark:bg-green-900/30 dark:text-green-400">
                <FaClock className="text-sm" />
                <span>Rented: {timeAgo(slot.rentedAt._seconds)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <button className={buttonClass}>
        {icon} {statusText}
      </button>
    </div>
  );
};

const Slots = () => {
  const [stations, setStations] = useState([]);
  const [selected, setSelected] = useState('');
  const [slots, setSlots] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, available: 0, rented: 0, overdue: 0 });
  const [stationInfo, setStationInfo] = useState(null);

  const loadStations = async () => {
    try {
      const response = await apiService.getStations();
      setStations(response.data.stations || []);
      if (response.data.stations?.length) setSelected(response.data.stations[0].id);
    } catch {
      setError('Failed to load stations');
    }
  };

  const loadSlots = async () => {
    if (!selected) return;
    setLoading(true);
    setError('');
    try {
      const response = await apiService.getStationStats(selected);
      const station = response.data.station;

      if (!station) {
        setError('Station data not found');
        setSlots([]);
        setStats({ total: 0, available: 0, rented: 0, overdue: 0 });
        setStationInfo(null);
      } else if (station.station_status === 'Offline') {
        setError(`Station "${station.name}" is currently offline`);
        setSlots([]);
        setStats({ total: station.totalSlots || 0, available: 0, rented: 0, overdue: 0 });
        setStationInfo(station);
      } else {
        setSlots(Array.isArray(station.batteries) ? station.batteries : []);
        setStats({
          total: station.totalSlots || 0,
          available: station.availableCount || 0,
          rented: station.rentedCount || 0,
          overdue: station.overdueCount || 0
        });
        setStationInfo(station);
      }
    } catch {
      setError('Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStations();
  }, []);

  useEffect(() => {
    if (selected) loadSlots();
  }, [selected]);

  const filtered = slots.filter(
    (s) =>
      !search ||
      s.slot_id.toString().includes(search) ||
      s.battery_id?.toLowerCase().includes(search.toLowerCase()) ||
      s.status?.toLowerCase().includes(search.toLowerCase())
  );

  const statCards = [
    { label: 'Total Slots', value: stats.total, icon: <FaPlug className="text-blue-500" /> },
    { label: 'Available', value: stats.available, icon: <FaCheckCircle className="text-green-500" /> },
    { label: 'Occupied', value: stats.rented, icon: <FaLock className="text-blue-500" /> },
    { label: 'Overdue', value: stats.overdue, icon: <FaExclamationTriangle className="text-red-500" /> }
  ];

  return (
    <div className="max-w-3xl p-4 mx-auto">
      <h3 className="mb-1 text-2xl font-bold dark:text-white">Slot Management</h3>
      {stationInfo && (
        <p className="mb-4 text-gray-500 dark:text-gray-400">
          Station:{' '}
          <span className="font-semibold text-blue-600 dark:text-blue-400">{stationInfo.name}</span> (
          {stationInfo.location}) – Status:{' '}
          <span
            className={`font-semibold ml-1 ${
              stationInfo.station_status === 'Online' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {stationInfo.station_status}
          </span>
        </p>
      )}

      <div className="flex flex-col gap-2 mb-4 sm:flex-row">
        <div className="flex items-center w-full px-3 py-2 bg-white border rounded-lg sm:w-auto dark:bg-gray-800 dark:border-gray-700">
          <FaMapMarkerAlt className="mr-2 text-blue-500" />
          <select
            className="w-full bg-transparent outline-none"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            {stations.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative flex-1">
          <FaSearch className="absolute text-gray-400 left-3 top-3" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full py-2 pl-10 pr-10 border rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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

        <button
          onClick={loadSlots}
          className="flex items-center justify-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          <FaSyncAlt /> Refresh Now
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4 sm:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {loading ? (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">Loading...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-600 dark:text-red-400">{error}</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((s) => (
            <SlotCard key={s.slot_id} slot={s} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Slots;
