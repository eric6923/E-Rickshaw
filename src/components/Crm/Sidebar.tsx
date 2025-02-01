import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  LogOut, 
  X, 
  Users, 
  ChevronDown,
  ChevronRight,
  FileText, 
  AlertTriangle,
  FolderOpen,
  HandCoins,
  Banknote,
  Landmark
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentPath: string;
  userRole: string | null;
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  currentPath,
  userRole = "team",
}: SidebarProps) {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string | null>(null);
  
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

  const roleBasePath = `/crm/${userRole}`;

  const managementSections = (userRole === 'admin' || userRole === 'manager') && [
    {
      title: "Defaulter Management",
      icon: <Landmark size={20} />,
      mainPath: `${roleBasePath}/clients`,
      subLinks: [
        {
          title: "Logs",
          icon: <FolderOpen size={18} />,
          path: `${roleBasePath}/clients`
        },
        {
          title: "Reports",
          icon: <FileText size={18} />,
          path: `/crm/admin/reports/default`
        }
      ]
    },
    {
      title: "Loan Management",
      icon: <Banknote size={20} />,
      mainPath: `${roleBasePath}/contacts`,
      subLinks: [
        {
          title: "Logs",
          icon: <FolderOpen size={18} />,
          path: `${roleBasePath}/contacts`
        },
        {
          title: "Reports",
          icon: <FileText size={18} />,
          path: `/crm/admin/reports/loans`
        }
      ]
    }
  ];

  const toggleSection = (title: string) => {
    setOpenSection(openSection === title ? null : title);
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 transition-all duration-300 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} 
        w-[280px] shadow-lg z-50`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 h-16 mt-6">
        <Link to={roleBasePath} className="flex items-center">
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

      {/* Navigation - Added responsive spacing */}
      <nav className="mt-3 px-4 pb-28 lg:pb-28 overflow-y-auto">
        <Link
          to={roleBasePath}
          className={`flex items-center w-full p-2.5 lg:p-3 rounded-lg transition-colors mb-1.5 lg:mb-2 ${
            currentPath === roleBasePath
              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700"
          }`}
          onClick={() => setSidebarOpen(false)}
        >
          <LayoutDashboard size={20} />
          <span className="ml-3 font-medium">Dashboard</span>
        </Link>

        {/* Management Sections with Nested Links */}
        {managementSections && managementSections.map((section) => (
          <div key={section.title} className="mb-2">
            <div 
              onClick={() => toggleSection(section.title)}
              className={`flex items-center w-full p-2.5 lg:p-3 rounded-lg transition-colors cursor-pointer ${
                currentPath === section.mainPath
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
                    key={link.title}
                    to={link.path}
                    className={`flex items-center w-full p-2 rounded-lg transition-colors mb-1 ${
                      currentPath === link.path
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {link.icon || <div className="w-5 h-5 opacity-0" />}
                    <span className="ml-3 font-medium text-sm">{link.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Bottom Actions */}
        <div className="fixed bottom-0 left-0 w-[280px] p-3 lg:p-4 border-gray-200 bg-white dark:bg-gray-800">
          <button
            onClick={() => {
              localStorage.removeItem("crmAuthenticated");
              localStorage.removeItem("token");
              localStorage.removeItem("userRole");
              navigate("/crm/login");
              setSidebarOpen(false);
            }}
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