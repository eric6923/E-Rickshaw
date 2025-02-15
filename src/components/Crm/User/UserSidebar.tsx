import { Link, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  LogOut, 
  X, 
  User,
  ShoppingBag,
  Wrench
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentPath: string;
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  currentPath,
}: SidebarProps) {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/"
    },
    {
      title: "Profile",
      icon: <User size={20} />,
      path: "/profile"
    },
    {
      title: "Orders",
      icon: <ShoppingBag size={20} />,
      path: "/orders"
    },
    {
      title: "Services",
      icon: <Wrench size={20} />,
      path: "/services"
    }
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 transition-all duration-300 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} 
        w-[280px] shadow-lg z-50`}
    >
      <div className="flex items-center justify-between p-6 h-16 mt-6">
        <Link to="/" className="flex items-center">
          <span className="ml-3 text-xl font-bold text-blue-600 dark:text-white">
            User Dashboard
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      <nav className="mt-5 px-4 pb-36 lg:pb-36 overflow-y-auto h-[calc(100vh-88px)]">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center w-full p-2.5 lg:p-3 rounded-lg transition-colors mb-1.5 lg:mb-2 ${
              currentPath === item.path
                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            {item.icon}
            <span className="ml-3 font-medium">{item.title}</span>
          </Link>
        ))}

        <div className="fixed bottom-0 left-0 w-[280px] p-4 border-t border-gray-200 bg-white dark:bg-gray-800">
          <button
            onClick={() => {
              localStorage.removeItem("userAuthenticated");
              localStorage.removeItem("userToken");
              navigate("/login");
              setSidebarOpen(false);
            }}
            className="flex items-center w-full p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
          >
            <LogOut size={20} />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}