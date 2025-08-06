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
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useNavigate, useLocation } from 'react-router-dom';
import { isAdmin, getUserDisplayRole } from '../utils/roleUtils';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { dark, setDark } = useDarkMode()
  const { user } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDarkMode = () => setDark((d) => !d)

  // Check if user is admin using utility function
  const userIsAdmin = isAdmin(user)

  // Define navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      {
        section: 'OVERVIEW',
        items: [
          { id: 'dashboard', label: t('dashboard'), icon: faTachometerAlt }
        ]
      }
    ]

    if (userIsAdmin) {
      // Admin sees all sections
      return [
        ...baseItems,
        {
          section: 'OPERATIONS',
          items: [
            { id: 'stations', label: t('stations'), icon: faStore },
            { id: 'slots', label: t('slots'), icon: faBatteryThreeQuarters },
            { id: 'revenue', label: t('revenue'), icon: faChartLine },
            // { id: 'rentals', label: t('rentals'), icon: faExchangeAlt }
          ]
        },
        {
          section: 'MANAGEMENT',
          items: [
            { id: 'users', label: t('users'), icon: faUsers },
            // { id: 'powerbanks', label: t('powerbanks'), icon: faBatteryFull },
            // { id: 'notifications', label: t('notifications'), icon: faBell }
          ]
        }
      ]
    } else {
      // Regular users see limited sections
      return [
        ...baseItems,
        {
          section: 'OPERATIONS',
          items: [
            { id: 'stations', label: t('stations'), icon: faStore },
            { id: 'slots', label: t('slots'), icon: faBatteryThreeQuarters },
            // Regular users don't see revenue analytics
            // { id: 'revenue', label: t('revenue'), icon: faChartLine },
          ]
        }
        // Regular users don't see management section
      ]
    }
  }

  const navigationItems = getNavigationItems()

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
      
      {/* User Role Indicator */}
      <div className="px-4 py-2 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Logged in as: <span className="font-medium text-gray-800 dark:text-white">{user?.username || 'User'}</span>
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            userIsAdmin 
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
          }`}>
            {getUserDisplayRole(user)}
          </span>
        </div>
      </div>
      
      <nav className="p-4 h-[calc(100%-120px)] overflow-y-auto">
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
        
        {/* Settings section - available for all users */}
        <div className="pt-4 mt-8 border-t dark:border-gray-700">
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
            <span>{t('settings')}</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Sidebar 