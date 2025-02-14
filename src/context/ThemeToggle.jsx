import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex h-5 w-10 items-center rounded-full
        transition-colors duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
        ${isDark ? 'bg-purple-600' : 'bg-gray-200'}
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className="sr-only">Toggle theme</span>
      
      {/* Toggle Thumb */}
      <span
        className={`
          absolute h-4 w-4 rounded-full
          transform transition-transform duration-300 ease-in-out
          ${isDark ? 'translate-x-5 bg-white' : 'translate-x-1 bg-white'}
          shadow-lg
        `}
      />

      {/* Sun Icon */}
      <FiSun 
        className={`
          absolute left-1 h-2.5 w-2.5
          transform transition-all duration-300
          ${isDark ? 'opacity-0 scale-0' : 'opacity-100 scale-100 text-yellow-700'}
        `}
      />

      {/* Moon Icon */}
      <FiMoon 
        className={`
          absolute right-1 h-2.5 w-2.5
          transform transition-all duration-300
          ${isDark ? 'opacity-100 scale-100 text-black' : 'opacity-0 scale-0'}
        `}
      />
    </button>
  );
};

export default ThemeToggle;
