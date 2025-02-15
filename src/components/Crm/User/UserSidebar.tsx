import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { 
  LayoutDashboard, 
  LogOut, 
  X, 
  ChevronDown,
  ChevronRight,
  FileText, 
  FolderOpen,
  Banknote,
  Truck,
  ShoppingCart,
  FileOutput,
  DollarSign,
  Wallet,
  Receipt,
  BatteryFull,
  Wrench,
  Package,
  CarFront,
  Files,
  FileSpreadsheet,
  FileCheck,
  UserCheck
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentPath: string;
}

interface UserPermissions {
  canManageERickshaw: boolean;
  canManageBattery: boolean;
  canManageSparesServices: boolean;
  canManageLoan: boolean;
  canManageAttendance: boolean;
  canManageDashboard: boolean;
}

interface DecodedToken {
  id: number;
  role: string;
  permissions: Array<{
    id: number;
    userId: number;
    canManageERickshaw: boolean;
    canManageBattery: boolean;
    canManageSparesServices: boolean;
    canManageLoan: boolean;
    canManageAttendance: boolean;
    canManageDashboard: boolean;
  }>;
  iat: number;
  exp?: number;
}

export const LOGIN_EVENT = 'userLoggedIn';

export default function UserSidebar({
  sidebarOpen,
  setSidebarOpen,
  currentPath,
}: SidebarProps) {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const validateToken = useCallback((token: string): UserPermissions | null => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      
      if (!decoded || !decoded.permissions || !decoded.permissions[0]) {
        console.error("Invalid token structure - missing permissions:", decoded);
        return null;
      }

      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        console.error("Token has expired");
        return null;
      }

      return decoded.permissions[0];
    } catch (error) {
      console.error("Token validation error:", error);
      return null;
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("userAuthenticated");
    localStorage.removeItem("token");
    setUserPermissions(null);
    setUserName("");
    navigate("/login");
    setSidebarOpen(false);
  }, [navigate, setSidebarOpen]);

  const managementSections = [
    {
      title: "E-Rickshaw",
      icon: <Truck size={20} />,
      mainPath: "/e-rickshaw",
      permission: 'canManageERickshaw',
      subLinks: [
        {
          title: "Document",
          icon: <Files size={18} />,
          path: "/e-rickshaw/document"
        },
        {
          title: "Quotation",
          icon: <Receipt size={18} />,
          path: "/e-rickshaw/quotation"
        },
        {
          title: "Temporary Driving",
          icon: <CarFront size={18} />,
          path: "/e-rickshaw/temporarydriving"
        },
        {
          title: "Purchase Invoice",
          icon: <FileText size={18} />,
          path: "/e-rickshaw/purchase-invoice"
        },
        {
          title: "Sales Order",
          icon: <ShoppingCart size={18} />,
          path: "/e-rickshaw/sales-order"
        },
        {
          title: "Loan File Transfer",
          icon: <FileOutput size={18} />,
          path: "/e-rickshaw/loan-file-transfer"
        },
        {
          title: "Payment Details",
          icon: <DollarSign size={18} />,
          path: "/e-rickshaw/payment-details"
        },
        {
          title: "Loan Details",
          icon: <Wallet size={18} />,
          path: "/e-rickshaw/loan-details"
        },
        {
          title: "Sales Invoice",
          icon: <Receipt size={18} />,
          path: "/e-rickshaw/sales-invoice"
        },
        {
          title: "RC Book",
          icon: <FileCheck size={18} />,
          path: "/e-rickshaw/rc-book"
        }
      ]
    },
    {
      title: "Battery",
      icon: <BatteryFull size={20} />,
      mainPath: "/battery",
      permission: 'canManageBattery',
      subLinks: [
        {
          title: "Purchase Invoice",
          icon: <FileText size={18} />,
          path: "/battery/purchase-invoice"
        },
        {
          title: "Sales Invoice",
          icon: <Receipt size={18} />,
          path: "/battery/sales-invoice"
        },
        {
          title: "Service Battery Replacement",
          icon: <FileSpreadsheet size={18} />,
          path: "/battery/service-replacement"
        }
      ]
    },
    {
      title: "Spares & Services",
      icon: <Wrench size={20} />,
      mainPath: "/spares-services",
      permission: 'canManageSparesServices',
      subLinks: [
        {
          title: "Inventory",
          icon: <Package size={18} />,
          path: "/spares-services/inventory"
        },
        {
          title: "Purchase Invoice",
          icon: <FileText size={18} />,
          path: "/spares-services/purchase-invoice"
        },
        {
          title: "Job Card",
          icon: <FileSpreadsheet size={18} />,
          path: "/spares-services/job-card"
        }
      ]
    },
    {
      title: "Loan Management",
      icon: <Banknote size={20} />,
      mainPath: "/loan",
      permission: 'canManageLoan',
      subLinks: [
        {
          title: "Logs",
          icon: <FolderOpen size={18} />,
          path: "/loan/logs"
        },
        // {
        //   title: "Reports",
        //   icon: <FileText size={18} />,
        //   path: "/loan/reports"
        // }
      ]
    }
  ];

  const checkAccess = useCallback(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      handleLogout();
      return false;
    }

    const permissions = validateToken(token);
    if (!permissions) {
      handleLogout();
      return false;
    }

    const decoded = jwtDecode<DecodedToken>(token);
    setUserPermissions(permissions);
    setUserName(decoded.role);

    const hasPermissionForPath = managementSections.some(section => {
      if (currentPath.startsWith(section.mainPath)) {
        return permissions[section.permission as keyof UserPermissions];
      }
      return false;
    });

    if (currentPath === '/attendance' && !permissions.canManageAttendance) {
      return false;
    }

    if (currentPath === '/dashboard' && !permissions.canManageDashboard) {
      return false;
    }

    if (!hasPermissionForPath && !permissions.canManageDashboard && currentPath !== '/attendance') {
      return false;
    }

    return true;
  }, [currentPath, handleLogout, validateToken]);

  useEffect(() => {
    setIsLoading(true);
    const hasAccess = checkAccess();
    
    if (!hasAccess) {
      handleLogout();
    }
    
    setIsLoading(false);
  }, [checkAccess, handleLogout, currentPath]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sidebarOpen]);

  const toggleSection = (title: string) => {
    setOpenSection(openSection === title ? null : title);
  };

  const getInitialLink = useCallback(() => {
    if (!userPermissions) return "/login";
    
    if (userPermissions.canManageDashboard) {
      return "/dashboard";
    }
    
    const firstAvailableSection = managementSections.find(
      section => userPermissions[section.permission as keyof UserPermissions]
    );
    
    if (firstAvailableSection) {
      return firstAvailableSection.mainPath;
    }
    
    if (userPermissions.canManageAttendance) {
      return "/attendance";
    }
    
    return "/login";
  }, [userPermissions]);

  if (isLoading) {
    return (
      <aside className="fixed top-0 left-0 h-full bg-white dark:bg-gray-800 w-[280px] shadow-lg z-50">
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      </aside>
    );
  }

  if (!userPermissions) {
    navigate('/login');
    return null;
  }

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 transition-all duration-300 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} 
        w-[280px] shadow-lg z-50`}
    >
      <div className="flex items-center justify-between p-6 h-16 mt-6">
        <Link to={getInitialLink()} className="flex items-center">
          <span className="ml-3 text-xl font-bold text-blue-600 dark:text-white">
            Vaishali Traders
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      <nav className="mt-5 px-4 pb-36 lg:pb-36 overflow-y-auto h-[calc(100vh-160px)]">
        {userPermissions.canManageDashboard && currentPath !== '/dashboard' && (
          <Link
            to="/dashboard"
            className={`flex items-center w-full p-2.5 lg:p-3 rounded-lg transition-colors mb-1.5 lg:mb-2 ${
              currentPath === "/dashboard"
                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <LayoutDashboard size={20} />
            <span className="ml-3 font-medium">Dashboard</span>
          </Link>
        )}

        {managementSections.map((section) => {
          const permissionKey = section.permission as keyof UserPermissions;
          if (!userPermissions[permissionKey]) {
            return null;
          }

          return (
            <div key={section.title} className="mb-2">
              <div 
                onClick={() => toggleSection(section.title)}
                className={`flex items-center w-full p-2.5 lg:p-3 rounded-lg transition-colors cursor-pointer ${
                  currentPath.startsWith(section.mainPath)
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700"
                }`}
              >
                {section.icon}
                <span className="ml-3 font-medium grow">{section.title}</span>
                {openSection === section.title ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </div>

              {openSection === section.title && (
                <div className="pl-6 mt-1">
                  {section.subLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center w-full p-2 rounded-lg transition-colors mb-1 ${
                        currentPath === link.path
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {link.icon}
                      <span className="ml-3 font-medium text-sm">{link.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {userPermissions.canManageAttendance && (
          <Link
            to="/attendance"
            className={`flex items-center w-full p-2.5 lg:p-3 rounded-lg transition-colors mb-1.5 lg:mb-2 ${
              currentPath === "/attendance"
                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <UserCheck size={20} />
            <span className="ml-3 font-medium">Attendance Register</span>
          </Link>
        )}

        <div className="fixed bottom-0 left-0 w-[280px] p-4 border-t border-gray-200 bg-white dark:bg-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-2.5 lg:p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
          >
            <LogOut size={20} />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}