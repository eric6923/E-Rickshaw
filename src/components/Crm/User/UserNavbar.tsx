import { useState, useRef, useEffect } from "react";
import { Menu, Sun, Moon, Settings, LogOut } from "lucide-react";
import profile from '../Admin/images.jpeg';
import { useNavigate } from "react-router-dom";

type UserRole = "admin" | "manager" | "team" | null;

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  userRole: UserRole;
}

export default function Navbar({
  sidebarOpen,
  setSidebarOpen,
  darkMode,
  setDarkMode,
  userRole
}: NavbarProps) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSettings = () => {
    navigate("/crm/settings");
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-white dark:bg-gray-800 h-16 fixed top-0 right-0 left-0 z-40 px-4 lg:px-6">
      <div className="h-full max-w-screen-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 dark:text-gray-300 lg:hidden"
          >
            <Menu size={24} />
          </button>
          <div className="hidden lg:block text-xl font-semibold text-gray-800 dark:text-white">
            Your Brand
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 p-2"
          >
            {darkMode ? (
              <Sun className="h-6 w-6 text-gray-800 dark:text-gray-200" />
            ) : (
              <Moon className="h-6 w-6 text-gray-800 dark:text-gray-200" />
            )}
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <img
                src={profile}
                alt="Profile"
                className="h-7 w-7 rounded-full cursor-pointer hover:ring-2 hover:ring-gray-300 transition-all object-cover"
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleSettings}
                  className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem("isAuthenticated");
                    localStorage.removeItem("token");
                    navigate("/login");
                    setSidebarOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}