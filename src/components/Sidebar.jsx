import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTachometerAlt, 
  faStore, 
  faBatteryThreeQuarters, 
  faChartLine, 
  faExchangeAlt,
  faUsers,
  faBatteryFull,
  faBell,
  faUserCog,
  faMoon,
  faSun,
  faTimes
} from '@fortawesome/free-solid-svg-icons'
import { useDarkMode } from '../context/DarkModeContext'
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { dark, setDark } = useDarkMode()
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDarkMode = () => setDark((d) => !d)

  const navigationItems = [
    {
      section: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: faTachometerAlt }
      ]
    },
    {
      section: 'OPERATIONS',
      items: [
        { id: 'stations', label: 'Stations', icon: faStore },
        { id: 'slots', label: 'Slot Management', icon: faBatteryThreeQuarters },
        { id: 'revenue', label: 'Revenue Analytics', icon: faChartLine },
        // { id: 'rentals', label: 'Active Rentals', icon: faExchangeAlt }
      ]
    },
    {
      section: 'MANAGEMENT',
      items: [
        { id: 'users', label: 'Users', icon: faUsers },
        // { id: 'powerbanks', label: 'Power Banks', icon: faBatteryFull },
        // { id: 'notifications', label: 'Notifications', icon: faBell }
      ]
    }
  ]

  const getPath = (id) => `/${id}`;

  return (
    <div className={`w-64 bg-white shadow-md dark:bg-gray-800 transition-all duration-300 fixed lg:static inset-y-0 left-0 z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Danab Power</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleDarkMode}
            className="p-2 text-gray-500 rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FontAwesomeIcon icon={dark ? faSun : faMoon} />
          </button>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-gray-500 rounded-lg lg:hidden dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
      
      <nav className="p-4 h-[calc(100%-64px)] overflow-y-auto">
        {navigationItems.map((section) => (
          <div key={section.section} className="mb-6">
            <h2 className="mb-2 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
              {section.section}
            </h2>
            {section.items.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  navigate(getPath(item.id));
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center py-2 px-2 rounded transition-colors duration-200 ${
                  location.pathname === getPath(item.id)
                    ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <FontAwesomeIcon icon={item.icon} className="mr-3" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        ))}
        
        {/* <div className="pt-4 mt-8 border-t dark:border-gray-700">
          <button
            onClick={() => {
              navigate('/settings');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center py-2 px-2 rounded transition-colors duration-200 ${
              location.pathname === '/settings'
                ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <FontAwesomeIcon icon={faUserCog} className="mr-3" />
            <span>Profile & Settings</span>
          </button>
        </div> */}
      </nav>
    </div>
  )
}

export default Sidebar 