import { useState } from 'react';
import { FaMapMarkerAlt, FaSearch, FaTimes, FaCheckCircle, FaExclamationTriangle, FaWrench, FaPlug, FaLock, FaBatteryFull, FaUnlockAlt } from 'react-icons/fa';
import Transactions from '../components/Transactions';

const stations = [
  'Coffee castello jubba',
  'Cafe Castello Hayat market Taleex',
  'Jazeera Hotel',
  'Mogadishu Mall',
  'Airport Terminal',
];

const slotStats = [
  { label: 'Total Slots', value: 6, icon: <FaPlug className="text-blue-500" /> },
  { label: 'Available', value: 0, icon: <FaCheckCircle className="text-green-500" /> },
  { label: 'Maintenance', value: 0, icon: <FaWrench className="text-yellow-500" /> },
  { label: 'Error', value: 0, icon: <FaExclamationTriangle className="text-red-500" /> },
  { label: 'Reserved', value: 0, icon: <FaLock className="text-purple-500" /> },
];

const slots = [
  { id: 1, status: 'Occupied', powerBank: 'PB-001-01', battery: 70, lastAction: 'Check-out', lastActionTime: '2 hours ago', station: 'Coffee castello jubba' },
  { id: 2, status: 'Occupied', powerBank: 'PB-001-02', battery: 60, lastAction: 'Check-out', lastActionTime: '2 hours ago', station: 'Coffee castello jubba' },
  { id: 3, status: 'Occupied', powerBank: 'PB-001-03', battery: 48, lastAction: 'Check-out', lastActionTime: '2 hours ago', station: 'Coffee castello jubba' },
  { id: 4, status: 'Occupied', powerBank: 'PB-001-04', battery: 55, lastAction: 'Check-out', lastActionTime: '2 hours ago', station: 'Cafe Castello Hayat market Taleex' },
  { id: 5, status: 'Occupied', powerBank: 'PB-001-05', battery: 85, lastAction: 'Check-out', lastActionTime: '2 hours ago', station: 'Cafe Castello Hayat market Taleex' },
  { id: 6, status: 'Occupied', powerBank: 'PB-001-06', battery: 13, lastAction: 'Check-out', lastActionTime: '2 hours ago', station: 'Jazeera Hotel' },
];

const statusStyles = {
  'Occupied': {
    color: 'bg-green-100 text-green-700 border-green-300',
    icon: <FaCheckCircle className="mr-1 text-green-500" />,
    label: 'Occupied',
  },
  'Available': {
    color: 'bg-gray-100 text-gray-700 border-gray-300',
    icon: <FaPlug className="mr-1 text-blue-500" />,
    label: 'Available',
  },
  'Maintenance': {
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    icon: <FaWrench className="mr-1 text-yellow-500" />,
    label: 'Maintenance',
  },
  'Error': {
    color: 'bg-red-100 text-red-700 border-red-300',
    icon: <FaExclamationTriangle className="mr-1 text-red-500" />,
    label: 'Error',
  },
  'Reserved': {
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    icon: <FaLock className="mr-1 text-purple-500" />,
    label: 'Reserved',
  },
};

function StatCard({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center p-3 text-center border border-gray-100 rounded-lg shadow bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 dark:border-gray-700">
      <div className="mb-1">{icon}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
      <div className="text-xl font-bold dark:text-white">{value}</div>
    </div>
  );
}

function getBatteryColor(battery) {
  if (battery >= 70) return 'bg-green-400';
  if (battery >= 40) return 'bg-yellow-400';
  return 'bg-red-500';
}

function SlotCard({ slot }) {
  const style = statusStyles[slot.status] || {};
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 border border-gray-100 dark:border-gray-800 flex flex-col justify-between min-h-[220px] transition-transform hover:-translate-y-1 hover:shadow-lg duration-200">
      <div className="flex items-center justify-between mb-2">
        <div className="text-lg font-bold dark:text-white">#{slot.id}</div>
        <div className={`flex items-center text-xs px-2 py-1 rounded-full font-semibold ${style.color || 'bg-gray-100 text-gray-700'}`}>{style.icon}{style.label}</div>
      </div>
      <div className="flex items-center mb-1">
        <FaBatteryFull className="mr-1 text-gray-400" />
        <span className="text-sm font-medium dark:text-white">Power Bank</span>
        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{slot.powerBank}</span>
      </div>
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">Battery Level</span>
          <span className="text-xs font-semibold dark:text-white">{slot.battery}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700">
          <div
            className={`h-2 rounded-full ${getBatteryColor(slot.battery)}`}
            style={{ width: `${slot.battery}%` }}
          ></div>
        </div>
      </div>
      <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">Last action: {slot.lastAction} <span className="ml-1">{slot.lastActionTime}</span></div>
      <button className="flex items-center justify-center w-full gap-2 py-2 mt-1 font-semibold text-gray-700 transition bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900">
        <FaUnlockAlt className="mr-1" /> Unlock
      </button>
    </div>
  );
}

const Slots = () => {
  const [selectedStation, setSelectedStation] = useState(stations[0]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');
  // const [showAllTransactions, setShowAllTransactions] = useState(false);

  const filteredSlots = slots.filter(
    (slot) =>
      slot.station === selectedStation &&
      (search === '' ||
        slot.id.toString().includes(search) ||
        slot.status.toLowerCase().includes(search.toLowerCase()) ||
        slot.powerBank.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-3xl p-4 mx-auto">
      <div className="mb-4">
        <h3 className="text-2xl font-bold dark:text-white">Slot Management</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Manage power bank slots at <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedStation}</span>
        </p>
      </div>
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center">
        <div className="flex items-center w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 sm:w-auto">
          <FaMapMarkerAlt className="mr-2 text-blue-500" />
          <select
            className="w-full bg-transparent outline-none"
            value={selectedStation}
            onChange={e => setSelectedStation(e.target.value)}
            aria-label="Select station"
          >
            {stations.map(station => (
              <option key={station} value={station}>{station}</option>
            ))}
          </select>
        </div>
        <div className="relative flex-1">
          <FaSearch className="absolute text-gray-400 left-3 top-3" />
          <input
            type="text"
            placeholder="Search slot or power bank..."
            className="w-full py-2 pl-10 pr-10 border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search slots"
          />
          {search && (
            <button
              className="absolute text-gray-400 right-3 top-2 hover:text-red-500"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4 sm:grid-cols-5">
        {slotStats.map(stat => (
          <StatCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} />
        ))}
      </div>
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
      {view === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filteredSlots.map(slot => (
            <SlotCard key={slot.id} slot={slot} />
          ))}
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredSlots.map(slot => (
            <div key={slot.id} className="flex items-center justify-between py-3">
              <div>
                <div className="font-bold dark:text-white">#{slot.id}</div>
                <div className="text-xs text-gray-400">Power Bank {slot.powerBank}</div>
                <div className="text-xs text-gray-400">Battery: {slot.battery}%</div>
                <div className="text-xs text-gray-400">Last action: {slot.lastAction} {slot.lastActionTime}</div>
              </div>
              <button className="flex items-center gap-1 px-3 py-1 font-semibold text-gray-700 transition bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900">
                <FaUnlockAlt className="mr-1" /> Unlock
              </button>
            </div>
          ))}
        </div>
      )}
      {/* <Transactions
        showAll={showAllTransactions}
        onViewAll={() => setShowAllTransactions(true)}
      />
      {showAllTransactions && (
        <button
          className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400"
          onClick={() => setShowAllTransactions(false)}
        >
          Show Less
        </button>
      )} */}
    </div>
  );
};

export default Slots; 