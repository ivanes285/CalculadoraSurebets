interface ThemeToggleProps {
  isDark: boolean
  toggleDarkMode: () => void
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, toggleDarkMode }) => {
  return (
    <button
      onClick={toggleDarkMode}
      className="p-3 rounded-full text-2xl text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 focus:outline-none transition"
    >
      {isDark ? "🌙" : "☀️"}
    </button>
  )
}