import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Stations from "./pages/Stations";
import Slots from "./pages/Slots";
import Revenue from "./pages/Revenue";
import Rentals from "./pages/Rentals";
import Users from "./pages/Users";
import PowerBanks from "./pages/PowerBanks";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import StationDetails from "./pages/StationDetails";
import StationComparison from "./pages/StationComparison";
import Blacklist from "./pages/Blacklist";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext.jsx";
import { LanguageProvider } from "./context/LanguageContext";

import "./App.css";

function App() {
  const { user, authLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-lg text-blue-600 dark:text-blue-300 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              user ? (
                <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
                  {/* Mobile Sidebar Overlay */}
                  {sidebarOpen && (
                    <div
                      className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                      onClick={() => setSidebarOpen(false)}
                    />
                  )}

                  {/* Sidebar */}
                  <Sidebar
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                  />

                  {/* Main Content */}
                  <div className="flex-1 overflow-auto">
                    <Topbar
                      currentPage={currentPage}
                      setSidebarOpen={setSidebarOpen}
                    />
                    <main className="flex-1">
                      <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="stations" element={<Stations />} />
                        <Route
                          path="station-comparison"
                          element={<StationComparison />}
                        />
                        <Route path="slots" element={<Slots />} />
                        <Route
                          path="revenue"
                          element={
                            <ProtectedRoute>
                              <Revenue />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="rentals" element={<Rentals />} />
                        <Route
                          path="users"
                          element={
                            <ProtectedRoute adminOnly={true}>
                              <Users />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="blacklist"
                          element={
                            <ProtectedRoute adminOnly={true}>
                              <Blacklist />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="powerbanks" element={<PowerBanks />} />
                        <Route
                          path="notifications"
                          element={<Notifications />}
                        />
                        <Route path="settings" element={<Settings />} />
                        <Route
                          path="/station/:imei"
                          element={<StationDetails />}
                        />
                        <Route
                          path="*"
                          element={<Navigate to="/dashboard" replace />}
                        />
                      </Routes>
                    </main>
                  </div>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
