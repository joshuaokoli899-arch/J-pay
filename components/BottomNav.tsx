import React from 'react';
import { View } from '../types';
import { ICONS } from '../constants';

interface BottomNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  view: View;
  label: string;
  activeView: View;
  onClick: (view: View) => void;
  children: React.ReactNode;
}> = ({ view, label, activeView, onClick, children }) => {
  const isActive = activeView === view;
  return (
    <button
      onClick={() => onClick(view)}
      className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${isActive ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
    >
      {children}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  const RecurringIcon = ICONS['recurring'];
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-20 bg-white dark:bg-green-900 border-t border-gray-200 dark:border-green-800 flex items-center justify-around">
      <NavItem view={View.DASHBOARD} label="Home" activeView={activeView} onClick={setActiveView}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
      </NavItem>
      <NavItem view={View.SAVINGS} label="Savings" activeView={activeView} onClick={setActiveView}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
      </NavItem>
       <NavItem view={View.RECURRING} label="Recurring" activeView={activeView} onClick={setActiveView}>
        <RecurringIcon />
      </NavItem>
      <NavItem view={View.ASSISTANT} label="Assistant" activeView={activeView} onClick={setActiveView}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
      </NavItem>
      <NavItem view={View.PROFILE} label="Profile" activeView={activeView} onClick={setActiveView}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
      </NavItem>
    </div>
  );
};

export default BottomNav;