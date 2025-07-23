import { useState, useEffect } from 'react';
import {
  FaMapMarkerAlt, FaSearch, FaTimes, FaCheckCircle, FaExclamationTriangle,
  FaPlug, FaLock, FaBatteryFull, FaUnlockAlt, FaPhoneAlt, FaClock
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

const getBatteryColor = (level) => (
  level >= 70 ? 'bg-green-400' : level >= 40 ? 'bg-yellow-400' : 'bg-red-500'
);

const SlotCard = ({ slot }) => {
  const isOccupied = slot.rented;
  const statusColor = isOccupied ? 'text-green-700 bg-green-100 border-green-300' : 'text-gray-700 bg-gray-100 border-gray-300';
  const statusIcon = isOccupied ? <FaCheckCircle className="text-green-500" /> : <FaPlug className="text-blue-500" />;
  const statusText = isOccupied ? 'Occupied' : 'Available';

  return (
    <div className="flex flex-col justify-between p-4 border rounded-xl shadow min-h-[220px] bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="flex justify-between mb-2">
        <div className="font-bold dark:text-white">#{slot.slot_id}</div>
        <div className={`flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
          {statusIcon}
          <span className="ml-1">{statusText}</span>
        </div>
      </div>

      <div className="flex items-center mb-1 text-sm dark:text-white">
        <FaBatteryFull className="mr-1 text-gray-400" />
        Battery ID: <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{slot.battery_id}</span>
      </div>

      <div className="mb-2">
        <div className="flex justify-between mb-1 text-xs dark:text-white">
          <span>Battery Level</span><span>{slot.level}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
          <div className={`h-2 rounded-full ${getBatteryColor(slot.level)}`} style={{ width: `${slot.level}%` }} />
        </div>
      </div>

      <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">
        Status: {statusText}
        {isOccupied && slot.phoneNumber && (
         <div className="mt-2 space-y-1 text-xs">
  {slot.phoneNumber && (
    <div className="flex items-center gap-2 px-2 py-1 text-blue-600 rounded-lg bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400">
      <FaPhoneAlt className="text-sm" />
      <span>{slot.phoneNumber}</span>
    </div>
  )}
  {slot.rentedAt?._seconds && (
    <div className="flex items-center gap-2 px-2 py-1 text-green-600 rounded-lg bg-green-50 dark:bg-green-900/30 dark:text-green-400">
      <FaClock className="text-sm" />
      <span>Rented: {timeAgo(slot.rentedAt._seconds)}</span>
    </div>
  )}
</div>

        )}
      </div>

      <button
        className={`w-full py-2 font-semibold rounded-lg flex justify-center items-center gap-2 transition
          ${isOccupied ? 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800' :
          'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-900'}`}
      >
        {isOccupied ? <FaUnlockAlt /> : <FaLock />}
        {isOccupied ? 'Unlock' : 'Lock'}
      </button>
    </div>
  );
};

const Slots = () => {
  const [stations, setStations] = useState([]);
  const [selected, setSelected] = useState('');
  const [slots, setSlots] = useState([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, available: 0, rented: 0 });

  useEffect(() => {
    const loadStations = async () => {
      try {
        const res = await fetch('https://danabbackend.onrender.com/api/stations/basic');
        const data = await res.json();
        setStations(data.stations || []);
        if (data.stations?.length) setSelected(data.stations[0].id);
      } catch {
        setError('Failed to load stations');
      }
    };
    loadStations();
  }, []);

  useEffect(() => {
    if (!selected) return;
    const loadSlots = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`https://danabbackend.onrender.com/api/stations/stats/${selected}`);
        const data = await res.json();

        if (data.station_status === 'Offline') {
          setError(`Station "${data.name}" is currently offline`);
          setSlots([]);
          setStats({ total: 0, available: 0, rented: 0 });
        } else {
          setSlots(Array.isArray(data.batteries) ? data.batteries : []);
          setStats({
            total: data.totalSlots || 0,
            available: data.availableCount || 0,
            rented: data.rentedCount || 0
          });
        }
      } catch {
        setError('Failed to load slots');
      } finally {
        setLoading(false);
      }
    };
    loadSlots();
  }, [selected]);

  const filtered = slots.filter(
    (s) => !search ||
      s.slot_id.toString().includes(search) ||
      s.battery_id?.toLowerCase().includes(search.toLowerCase()) ||
      s.status?.toLowerCase().includes(search.toLowerCase())
  );

  const statCards = [
    { label: 'Total Slots', value: stats.total || slots.length, icon: <FaPlug className="text-blue-500" /> },
    { label: 'Available', value: stats.available || slots.filter(s => !s.rented).length, icon: <FaCheckCircle className="text-green-500" /> },
    { label: 'Occupied', value: stats.rented || slots.filter(s => s.rented).length, icon: <FaLock className="text-purple-500" /> },
    { label: 'Error', value: slots.filter(s => s.status !== 'Online').length, icon: <FaExclamationTriangle className="text-red-500" /> },
  ];

  return (
    <div className="max-w-3xl p-4 mx-auto">
      <h3 className="mb-1 text-2xl font-bold dark:text-white">Slot Management</h3>
      <p className="mb-4 text-gray-500 dark:text-gray-400">
        Station: <span className="font-semibold text-blue-600 dark:text-blue-400">
          {stations.find(s => s.id === selected)?.location || '...'}
        </span>
      </p>

      <div className="flex flex-col gap-2 mb-4 sm:flex-row">
        <div className="flex items-center w-full px-3 py-2 bg-white border rounded-lg sm:w-auto dark:bg-gray-800 dark:border-gray-700">
          <FaMapMarkerAlt className="mr-2 text-blue-500" />
          <select className="w-full bg-transparent outline-none" value={selected} onChange={e => setSelected(e.target.value)}>
            {stations.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
          </select>
        </div>

        <div className="relative flex-1">
          <FaSearch className="absolute text-gray-400 left-3 top-3" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full py-2 pl-10 pr-10 border rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="absolute text-gray-400 right-3 top-2 hover:text-red-500" onClick={() => setSearch('')}>
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4 sm:grid-cols-4">
        {statCards.map(stat => <StatCard key={stat.label} {...stat} />)}
      </div>

      {loading ? (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">Loading...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-600 dark:text-red-400">{error}</div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map(s => <SlotCard key={s.slot_id} slot={s} />)}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(s => (
            <div key={s.slot_id} className="flex flex-col justify-between p-5 transition bg-white border border-gray-200 shadow sm:flex-row sm:items-center rounded-xl dark:bg-gray-900 dark:border-gray-700 hover:shadow-lg">
              <div className="space-y-3">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">Slot #{s.slot_id}</h4>
                <div className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-md 
                  ${s.rented 
                    ? 'text-yellow-800 bg-yellow-100 dark:bg-yellow-800 dark:text-yellow-100' 
                    : 'text-green-800 bg-green-100 dark:bg-green-800 dark:text-green-100'}`}>
                  {s.rented ? <FaLock className="text-sm" /> : <FaUnlockAlt className="text-sm" />}
                  {s.rented ? 'Occupied' : 'Available'}
                </div>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <button className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium shadow transition w-full sm:w-auto min-w-[120px]
                  ${s.rented
                    ? 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800'
                    : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'}`}>
                  {s.rented ? <><FaUnlockAlt /><span>Unlock</span></> : <><FaLock /><span>Lock</span></>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Slots;
