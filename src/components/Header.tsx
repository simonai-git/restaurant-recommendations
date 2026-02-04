'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  variant?: 'transparent' | 'solid';
}

export default function Header({ variant = 'solid' }: HeaderProps) {
  const isTransparent = variant === 'transparent';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300
                  ${isTransparent 
                    ? 'bg-transparent' 
                    : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50'
                  }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/"
            className={`flex items-center gap-2 transition-all duration-200 hover:opacity-80
                       ${isTransparent ? 'text-white' : ''}`}
          >
            <div className={`p-1.5 rounded-lg ${isTransparent ? 'bg-white/20' : 'bg-orange-100 dark:bg-orange-900/30'}`}>
              <svg
                className={`w-5 h-5 ${isTransparent ? 'text-white' : 'text-orange-500'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <span className={`font-semibold text-lg hidden sm:block
                             ${isTransparent 
                               ? 'text-white' 
                               : 'text-gray-800 dark:text-white'
                             }`}>
              Bay Area Eats
            </span>
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
