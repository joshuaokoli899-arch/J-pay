import React, { useState, useRef } from 'react';
import { User } from '../types';
import { ICONS } from '../constants';

interface ProfilePageProps {
  currentUser: User;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, theme, toggleTheme, onLogout, onUpdateUser }) => {
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const LogoutIcon = ICONS['logout'];
  const SunIcon = ICONS['sun'];
  const MoonIcon = ICONS['moon'];
  const CopyIcon = ICONS['copy'];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUser.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedUser = {
          ...currentUser,
          profilePictureUrl: reader.result as string,
        };
        onUpdateUser(updatedUser);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleBiometrics = () => {
    const updatedUser = {
      ...currentUser,
      biometricsEnabled: !currentUser.biometricsEnabled,
    };
    onUpdateUser(updatedUser);
  };

  return (
    <div className="flex flex-col h-full text-gray-800 dark:text-white p-4 pt-8 items-center">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="relative mb-4">
        <img
          src={currentUser.profilePictureUrl || `https://i.pravatar.cc/150?u=${currentUser.id}`}
          alt="User Avatar"
          className="w-24 h-24 rounded-full object-cover border-2 border-green-500"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-1.5 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
          </svg>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleProfilePictureChange}
          className="hidden"
          accept="image/png, image/jpeg"
        />
      </div>
      <p className="text-xl font-bold">{currentUser.name}</p>
      <p className="text-gray-500 dark:text-gray-400 mb-8">{currentUser.phone}</p>
      
      <div className="w-full bg-white dark:bg-green-900 rounded-lg p-4 mb-4">
        <h3 className="font-semibold mb-2 text-sm text-gray-500 dark:text-gray-400">Account Details</h3>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">J pay Account Number</p>
            <p className="text-lg font-mono text-gray-800 dark:text-white tracking-widest">{currentUser.accountNumber}</p>
          </div>
          <button onClick={handleCopy} className="bg-gray-200 dark:bg-green-800 text-gray-700 dark:text-gray-200 p-2 rounded-lg hover:bg-gray-300 dark:hover:bg-green-700 transition-colors duration-200 text-sm w-20">
            {copied ? 'Copied!' : <CopyIcon className="w-5 h-5 mx-auto" />}
          </button>
        </div>
      </div>

      <div className="w-full bg-white dark:bg-green-900 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Enable Biometric Login</span>
          <button onClick={toggleBiometrics} className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors duration-300 ${currentUser.biometricsEnabled ? 'bg-green-500 justify-end' : 'bg-gray-300 dark:bg-gray-700 justify-start'}`}>
            <div className="w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300"></div>
          </button>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold">Theme</span>
          <div className="flex items-center space-x-2">
            <SunIcon className="w-6 h-6 text-yellow-500" />
            <button onClick={toggleTheme} className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors duration-300 ${theme === 'light' ? 'bg-green-500 justify-start' : 'bg-gray-700 justify-end'}`}>
              <div className="w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300"></div>
            </button>
            <MoonIcon className="w-6 h-6 text-gray-400" />
          </div>
        </div>
      </div>

      <button 
        onClick={onLogout}
        className="mt-auto w-full flex items-center justify-center space-x-2 bg-green-200 dark:bg-green-800 hover:bg-red-200 dark:hover:bg-red-800 text-red-600 dark:text-red-400 font-bold py-3 px-4 rounded-lg transition-colors duration-200">
        <LogoutIcon className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default ProfilePage;