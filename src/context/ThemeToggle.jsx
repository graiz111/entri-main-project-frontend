import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="p-3 shadow-lg border rounded-full bg-gray-200 dark:bg-gray-800"
    >
      {theme === "dark" ? "☀️ " : "🌙 "}
    </button>
  );
};

export default ThemeToggle;
