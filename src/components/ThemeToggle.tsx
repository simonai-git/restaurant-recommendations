'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return placeholder to prevent layout shift
    return (
      <button
        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 w-10 h-10"
        aria-label="Toggle theme"
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-800 
                 hover:bg-gray-200 dark:hover:bg-gray-700
                 transition-all duration-300 ease-in-out
                 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
                 dark:focus:ring-offset-gray-900
                 group"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Sun icon */}
      <svg
        className={`w-5 h-5 transition-all duration-300 ease-in-out
                    ${isDark ? 'rotate-0 scale-100 text-yellow-400' : 'rotate-90 scale-0 text-gray-600'}
                    absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
      
      {/* Moon icon */}
      <svg
        className={`w-5 h-5 transition-all duration-300 ease-in-out
                    ${isDark ? '-rotate-90 scale-0 text-gray-400' : 'rotate-0 scale-100 text-gray-600'}
                    absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
      
      {/* Invisible spacer to maintain button size */}
      <span className="w-5 h-5 block opacity-0">
        <svg viewBox="0 0 24 24" />
      </span>
    </button>
  );
}
