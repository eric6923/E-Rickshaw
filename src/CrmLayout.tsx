import { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from './components/Crm/Navbar';
import Sidebar from "./components/Crm/Sidebar";
import Dashboard from './components/Crm/Admin/Dashboard';

import PurchaseInvoice from './components/Crm/Admin/ERickshaw/PurchaseInvoice';
import SalesOrder from './components/Crm/Admin/ERickshaw/SalesOrder';
import LoanFileTransfer from './components/Crm/Admin/ERickshaw/LoanFileTransfer';
import PaymentDetails from './components/Crm/Admin/ERickshaw/PaymentDetails';
import LoanDetails from './components/Crm/Admin/ERickshaw/LoanDetails';
import SalesInvoice from './components/Crm/Admin/ERickshaw/SalesInvoice';
import RcBook from './components/Crm/Admin/ERickshaw/RcBook';
import Documents from "./components/Crm/Admin/ERickshaw/Document";
import Quotation from "./components/Crm/Admin/ERickshaw/Quotation";
import TemporaryDriving from "./components/Crm/Admin/ERickshaw/TemporaryDriving";

import BatteryPurchaseInvoice from './components/Crm/Admin/Battery/PurchaseInvoice';
import BatterySalesInvoice from './components/Crm/Admin/Battery/SalesInvoive';
import BatteryServiceReplacement from './components/Crm/Admin/Battery/ServiceReplacement';

import Inventory from "./components/Crm/Admin/Spares&Services/Inventory";
import PurchaseInvoiceSpares from './components/Crm/Admin/Spares&Services/PurchaseInvoiceSpares';
import JobCard from "./components/Crm/Admin/Spares&Services/JobCard";

import LoanManagement from './components/Crm/Admin/LoanManagement'
import LoanReports from './components/Crm/Admin/LoanReports'

import TeamManagement from "./components/Crm/Admin/TeamManagement";
import AttendanceRegister from "./components/Crm/Admin/AttendanceRegister";

import Login from './components/Crm/Login'

interface LayoutProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("crmAuthenticated") === "true" && localStorage.getItem("token");
  const location = useLocation();

  if (!isAuthenticated) {
    localStorage.removeItem("crmAuthenticated");
    localStorage.removeItem("token");
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const CrmRoutes = ({ darkMode, setDarkMode }: LayoutProps) => {
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

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPath={location.pathname}
      />

      <div className="flex-1 flex flex-col transition-all duration-300 lg:ml-[280px]">
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <main className={`flex-1 overflow-auto pt-16 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="p-4 lg:p-6">
            <Routes>
              {/* Dashboard */}
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* E-Rickshaw Routes */}
              <Route path="/e-rickshaw/document" element={<Documents />} />
              <Route path="/e-rickshaw/quotation" element={<Quotation />} />
              <Route path="/e-rickshaw/temporarydriving" element={<TemporaryDriving />} />
              <Route path="/e-rickshaw/purchase-invoice" element={<PurchaseInvoice />} />
              <Route path="/e-rickshaw/sales-order" element={<SalesOrder />} />
              <Route path="/e-rickshaw/loan-file-transfer" element={<LoanFileTransfer />} />
              <Route path="/e-rickshaw/payment-details" element={<PaymentDetails />} />
              <Route path="/e-rickshaw/loan-details" element={<LoanDetails />} />
              <Route path="/e-rickshaw/sales-invoice" element={<SalesInvoice />} />
              <Route path="/e-rickshaw/rc-book" element={<RcBook />} />

              {/* Battery Routes */}
              <Route path="/battery/purchase-invoice" element={<BatteryPurchaseInvoice />} />
              <Route path="/battery/sales-invoice" element={<BatterySalesInvoice />} />
              <Route path="/battery/service-replacement" element={<BatteryServiceReplacement />} />

              {/* Spares & Services Routes */}
              <Route path="/spares-services/inventory" element={<Inventory />} />
              <Route path="/spares-services/purchase-invoice" element={<PurchaseInvoiceSpares />} />
              <Route path="/spares-services/job-card" element={<JobCard />} />

              {/* Loan Management Route */}
              <Route path="/loan/logs" element={<LoanManagement />} />
              <Route path="/loan/reports" element={<LoanReports />} />

              {/* Team & Attendance */}
              <Route path="/team" element={<TeamManagement />} />
              <Route path="/attendance" element={<AttendanceRegister />} />

              {/* Default Redirect */}
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default function CrmLayout({ darkMode, setDarkMode }: LayoutProps) {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          localStorage.getItem("crmAuthenticated") === "true" && 
          localStorage.getItem("token") ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Login/> // Replace with actual Login component
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