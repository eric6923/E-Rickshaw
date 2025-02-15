import { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import UserSidebar from './components/Crm/User/UserSidebar';
import UserNavbar from './components/Crm/User/UserNavbar';
import UserDashboard from './components/Crm/User/UserDashboard';
import UserLogin from "./components/Crm/User/UserLogin";

import UserDocument from './components/Crm/User/UserERickshaw/UserDocument'
import UserLoanDetails from './components/Crm/User/UserERickshaw/UserLoanDetails'
import UserLoanFileTransfer from './components/Crm/User/UserERickshaw/UserLoanFileTransfer'
import UserPaymentDetails from './components/Crm/User/UserERickshaw/UserPaymentDetails'
import UserPurchaseInvoice from './components/Crm/User/UserERickshaw/UserPurchaseInvoice'
import UserQuotation from './components/Crm/User/UserERickshaw/UserQuotation'
import UserRCBook from './components/Crm/User/UserERickshaw/UserRCBook'
import UserSalesInvoice from './components/Crm/User/UserERickshaw/UserSalesInvoice'
import UserSalesOrder from './components/Crm/User/UserERickshaw/UserSalesOrder'
import UserTemporaryDriving from './components/Crm/User/UserERickshaw/UserTemporaryDriving'

import UserBatteryPurchaseInvoice from './components/Crm/User/UserBattery/UserPurchaseInvoice'
import UserBatterySalesInvoice from './components/Crm/User/UserBattery/UserSalesInvoice'
import UserServiceReplacement from './components/Crm/User/UserBattery/UserServiceReplacement'

import UserSparesPurchaseInvoice from './components/Crm/User/UserSpares/UserPurchaseInvoiceSpares'
import UserInventory from './components/Crm/User/UserSpares/UserInventory'
import UserJobCard from './components/Crm/User/UserSpares/UserJobCard'

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
              
              {/* E-Rickshaw Routes */}
              <Route path="/e-rickshaw/document" element={<UserDocument/>} />
              <Route path="/e-rickshaw/quotation" element={<UserQuotation/>} />
              <Route path="/e-rickshaw/temporarydriving" element={<UserTemporaryDriving/>} />
              <Route path="/e-rickshaw/purchase-invoice" element={<UserPurchaseInvoice/>} />
              <Route path="/e-rickshaw/sales-order" element={<UserSalesOrder/>} />
              <Route path="/e-rickshaw/loan-file-transfer" element={<UserLoanFileTransfer/>} />
              <Route path="/e-rickshaw/payment-details" element={<UserPaymentDetails/>} />
              <Route path="/e-rickshaw/loan-details" element={<UserLoanDetails/>} />
              <Route path="/e-rickshaw/sales-invoice" element={<UserSalesInvoice/>} />
              <Route path="/e-rickshaw/rc-book" element={<UserRCBook/>} />

              {/* Battery Routes */}
              <Route path="/battery/purchase-invoice" element={<UserBatteryPurchaseInvoice/>} />
              <Route path="/battery/sales-invoice" element={<UserBatterySalesInvoice/>} />
              <Route path="/battery/service-replacement" element={<UserServiceReplacement/>} />

              {/* Spares & Services Routes */}
              <Route path="/spares-services/inventory" element={<UserInventory/>} />
              <Route path="/spares-services/purchase-invoice" element={<UserSparesPurchaseInvoice/>} />
              <Route path="/spares-services/job-card" element={<UserJobCard/>} />

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
            <Navigate to="/" replace />
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