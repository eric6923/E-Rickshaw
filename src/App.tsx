import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import CrmLayout from './CrmLayout';
import UserLayout from './UserLayout';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <Routes>
        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={<CrmLayout darkMode={darkMode} setDarkMode={setDarkMode} />}
        />
        
        {/* User Routes */}
        <Route
          path="/*"
          element={<UserLayout darkMode={darkMode} setDarkMode={setDarkMode} />}
        />
      </Routes>
    </div>
  );
}
