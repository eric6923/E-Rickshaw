import { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import CrmLogin from './components/Crm/Login';
import Navbar from './components/Crm/Navbar';
import Sidebar from "./components/Crm/Sidebar";

import Dashboard from './components/Crm/Admin/Dashboard';

// Import new management components
import AdminClientManagement from './components/Crm/Admin/DefaulterManagent';
import AdminContactManagement from './components/Crm/Admin/LoanManagement';
import Settings from './components/Crm/Admin/Settings'
import DefaulterReport from "./components/Crm/Admin/DefaulterReport";
import LoanReports from "./components/Crm/Admin/LoanReports";


import PurchaseInvoice from './components/Crm/Admin/ERickshaw/PurchaseInvoice';
import SalesOrder from './components/Crm/Admin/ERickshaw/SalesOrder';
import LoanFileTransfer from './components/Crm/Admin/ERickshaw/LoanFileTransfer';
import PaymentDetails from './components/Crm/Admin/ERickshaw/PaymentDetails';
import LoanDetails from './components/Crm/Admin/ERickshaw/LoanDetails';
import SalesInvoice from './components/Crm/Admin/ERickshaw/SalesInvoice';
import RcBook from './components/Crm/Admin/ERickshaw/RcBook';

import BatteryPurchaseInvoice from './components/Crm/Admin/Battery/PurchaseInvoice'
import BatterySalesInvoice from './components/Crm/Admin/Battery/SalesInvoive'
import BatteryServiceReplacement from './components/Crm/Admin/Battery/ServiceReplacement'
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
              <Route path="/admin/settings" element={<Settings />} />

              {/* E-Rickshaw Routes */}
              <Route path="/admin/e-rickshaw/purchase-invoice" element={<PurchaseInvoice />} />
              <Route path="/admin/e-rickshaw/sales-order" element={<SalesOrder />} />
              <Route path="/admin/e-rickshaw/loan-file-transfer" element={<LoanFileTransfer />} />
              <Route path="/admin/e-rickshaw/payment-details" element={<PaymentDetails />} />
              <Route path="/admin/e-rickshaw/loan-details" element={<LoanDetails />} />
              <Route path="/admin/e-rickshaw/sales-invoice" element={<SalesInvoice />} />
              <Route path="/admin/e-rickshaw/rc-book" element={<RcBook />} />

              {/* Battery Routes */}
              <Route path="/admin/battery/purchase-invoice" element={<BatteryPurchaseInvoice />} />
              <Route path="/admin/battery/sales-invoice" element={<BatterySalesInvoice />} />
              <Route path="/admin/battery/service-replacement" element={<BatteryServiceReplacement />} />


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