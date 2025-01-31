import { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import CrmLogin from './components/Crm/Login';
import Navbar from './components/Crm/Navbar';
import Sidebar from "./components/Crm/Sidebar";
import DashboardManager from "./components/Crm/Manager/DashboardManager";
import Dashboard from './components/Crm/Admin/Dashboard';

// Import new management components
import AdminClientManagement from './components/Crm/Admin/ClientManagent';
import AdminContactManagement from './components/Crm/Admin/ContactManagement';
import AdminProjectManagement from './components/Crm/Admin/ProjectManagement';
import AdminTaskManagement from './components/Crm/Admin/TaskManagement';
import Settings from './components/Crm/Admin/Settings'
import ManagerClientManagement from './components/Crm/Manager/ClientManagement';
import ManagerContactManagement from './components/Crm/Manager/ContactManagement';
import ManagerProjectManagement from './components/Crm/Manager/ProjectManagement';
import ManagerTaskManagement from './components/Crm/Manager/TaskManagement';
import SettingsManager from "./components/Crm/Manager/SettingsManager";
import PropsalGeneration from "./components/Crm/Admin/PropsalGeneration";
import InvoiceGeneration from "./components/Crm/Admin/InvoiceGeneration";
import Contract from "./components/Crm/Admin/Contract";
import DefaulterReport from "./components/Crm/Admin/DefaulterReport";
import LoanReports from "./components/Crm/Admin/LoanReports";

interface LayoutProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

type UserRole = "admin" | "manager" | "team" | null;

const ROLE_BASE_PATHS: Record<NonNullable<UserRole>, string> = {
  admin: "/crm/admin",
  manager: "/crm/manager",
  team: "/crm/team"
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("crmAuthenticated") === "true" && localStorage.getItem("token");
  const location = useLocation();
  const userRole = localStorage.getItem("userRole") as UserRole;

  if (!isAuthenticated) {
    localStorage.removeItem("crmAuthenticated");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    return <Navigate to="/crm/login" state={{ from: location }} replace />;
  }

  const currentPath = location.pathname;
  const pathParts = currentPath.split('/');
  if (pathParts[1] === 'crm' && pathParts[2] && pathParts[2] !== userRole && pathParts[2] !== 'login') {
    return <Navigate to={ROLE_BASE_PATHS[userRole || "admin"]} replace />;
  }

  return <>{children}</>;
};

const CrmRoutes = ({ darkMode, setDarkMode }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const userRole = localStorage.getItem("userRole") as UserRole;

  return (
    <div className="flex h-screen overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-800/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPath={location.pathname}
        userRole={userRole}
      />

      <div className="flex-1 flex flex-col transition-all duration-300 lg:ml-[280px]">
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          userRole={userRole}
        />

        <main className={`flex-1 overflow-auto pt-16 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="p-4 lg:p-6">
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/clients" element={<AdminClientManagement />} />
              <Route path="/admin/reports/default" element={<DefaulterReport />} />
              <Route path="/admin/reports/loans" element={<LoanReports />} />


              <Route path="/admin/contacts" element={<AdminContactManagement />} />
              <Route path="/admin/projects" element={<AdminProjectManagement />} />
              <Route path="/admin/tasks" element={<AdminTaskManagement />} />
              <Route path="/admin/proposal" element={<PropsalGeneration />} />
              <Route path="/admin/invoice" element={<InvoiceGeneration />} />
              <Route path="/admin/contract" element={<Contract />} />
              <Route path="/admin/settings" element={<Settings />} />

              {/* Manager Routes */}
              <Route path="/manager" element={<DashboardManager />} />
              <Route path="/manager/clients" element={<ManagerClientManagement />} />
              <Route path="/manager/contacts" element={<ManagerContactManagement />} />
              <Route path="/manager/projects" element={<ManagerProjectManagement />} />
              <Route path="/manager/tasks" element={<ManagerTaskManagement />} />
              <Route path="/manager/settings" element={<SettingsManager />} />

              {/* Team Routes */}

              {/* Default Redirect */}
              <Route
                path="*"
                element={
                  <Navigate
                    to={ROLE_BASE_PATHS[userRole || "admin"]}
                    replace
                  />
                }
              />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default function CrmLayout({ darkMode, setDarkMode }: LayoutProps) {
  const userRole = localStorage.getItem("userRole") as UserRole;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to={ROLE_BASE_PATHS[userRole || "admin"]} replace />
          </ProtectedRoute>
        }
      />

      <Route
        path="/login"
        element={
          localStorage.getItem("crmAuthenticated") === "true" && 
          localStorage.getItem("token") ? (
            <Navigate to={ROLE_BASE_PATHS[userRole || "admin"]} replace />
          ) : (
            <CrmLogin />
          )
        }
      />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <CrmRoutes darkMode={darkMode} setDarkMode={setDarkMode} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}