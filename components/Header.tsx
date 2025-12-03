import React from 'react';

interface HeaderProps {
    userName: string;
    profilePictureUrl: string;
}

const Header: React.FC<HeaderProps> = ({ userName, profilePictureUrl }) => {
  return (
    <header className="flex justify-between items-center p-4">
      <div className="flex items-center space-x-3">
        <img
          src={profilePictureUrl}
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-300">Welcome back,</p>
          <p className="font-bold text-gray-900 dark:text-white">{userName}</p>
        </div>
      </div>
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-600 dark:text-gray-200"
          fill="none"
          viewBox="0 0 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-gray-50 dark:ring-green-950"></span>
      </div>
    </header>
  );
};

export default Header;