import { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import UserSidebar from './components/Crm/User/UserSidebar'
import UserNavbar from './components/Crm/User/UserNavbar'
import Dashboard from './components/Crm/User/UserDashboard';
import UserLogin from "./components/Crm/User/UserLogin";
import UserDashboard from "./components/Crm/User/UserDashboard";

interface LayoutProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("userAuthenticated") === "true" && localStorage.getItem("token");
  const location = useLocation();

  if (!isAuthenticated) {
    localStorage.removeItem("userAuthenticated");
    localStorage.removeItem("token");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const UserRoutes = ({ darkMode, setDarkMode }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-800/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <UserSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPath={location.pathname}
      />

      <div className="flex-1 flex flex-col transition-all duration-300 lg:ml-[280px]">
        <UserNavbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <main className={`flex-1 overflow-auto pt-16 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="p-4 lg:p-6">
            <Routes>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default function UserLayout({ darkMode, setDarkMode }: LayoutProps) {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          localStorage.getItem("userAuthenticated") === "true" && 
          localStorage.getItem("token") ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <UserLogin />
          )
        }
      />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <UserRoutes darkMode={darkMode} setDarkMode={setDarkMode} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}