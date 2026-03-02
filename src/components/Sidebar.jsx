import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faStore,
  faBatteryThreeQuarters,
  faChartLine,
  faUsers,
  faMoon,
  faSun,
  faTimes,
  faChartBar,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import { useDarkMode } from "../context/DarkModeContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate, useLocation } from "react-router-dom";
import { ROLES, getUserRole } from "../utils/permissions";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { dark, setDark } = useDarkMode();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDarkMode = () => setDark((d) => !d);

  // Get current user role
  const userRole = getUserRole();

  // Define navigation items based on user role
  const getNavigationItems = () => {
    // USER role: Only Slots section (read-only)
    if (userRole === ROLES.USER) {
      return [
        {
          section: "OPERATIONS",
          items: [
            { id: "slots", label: t("slots"), icon: faBatteryThreeQuarters },
          ],
        },
      ];
    }

    // MODERATOR role: Dashboard + all operations + blacklist (no users management)
    if (userRole === ROLES.MODERATOR) {
      return [
        {
          section: "OVERVIEW",
          items: [{ id: "home", label: t("dashboard"), icon: faTachometerAlt }],
        },
        {
          section: "OPERATIONS",
          items: [
            { id: "stations", label: t("stations"), icon: faStore },
            {
              id: "station-comparison",
              label: "Station Comparison",
              icon: faChartBar,
            },
            { id: "slots", label: t("slots"), icon: faBatteryThreeQuarters },
            { id: "revenue", label: t("revenue"), icon: faChartLine },
          ],
        },
        {
          section: "MANAGEMENT",
          items: [{ id: "blacklist", label: "Blacklist", icon: faBan }],
        },
      ];
    }

    // ADMIN role: Full access to everything
    if (userRole === ROLES.ADMIN) {
      return [
        {
          section: "OVERVIEW",
          items: [{ id: "home", label: t("dashboard"), icon: faTachometerAlt }],
        },
        {
          section: "OPERATIONS",
          items: [
            { id: "stations", label: t("stations"), icon: faStore },
            {
              id: "station-comparison",
              label: "Station Comparison",
              icon: faChartBar,
            },
            { id: "slots", label: t("slots"), icon: faBatteryThreeQuarters },
            { id: "revenue", label: t("revenue"), icon: faChartLine },
          ],
        },
        {
          section: "MANAGEMENT",
          items: [
            { id: "users", label: t("users"), icon: faUsers },
            { id: "blacklist", label: "Blacklist", icon: faBan },
          ],
        },
      ];
    }

    // Fallback: empty navigation
    return [];
  };

  const navigationItems = getNavigationItems();

  const getPath = (id) => `/${id}`;

  return (
    <div
      className={`w-64 bg-white shadow-md dark:bg-gray-800 transition-all duration-300 fixed lg:static inset-y-0 left-0 z-50 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          Danab Power
        </h1>
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
            Logged in as:{" "}
            <span className="font-medium text-gray-800 dark:text-white">
              {user?.username || "User"}
            </span>
          </span>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              userRole === ROLES.ADMIN
                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                : userRole === ROLES.MODERATOR
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            }`}
          >
            {userRole
              ? userRole.charAt(0).toUpperCase() + userRole.slice(1)
              : "User"}
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
                    ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
          {/* <button
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
          </button> */}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
