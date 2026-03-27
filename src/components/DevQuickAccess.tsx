import React from 'react';
import { Screen } from '../types';

interface DevQuickAccessProps {
  onNavigate: (screen: Screen) => void;
}

const DevQuickAccess: React.FC<DevQuickAccessProps> = ({ onNavigate }) => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-gray-800 text-white p-2 rounded text-xs">
      <div>Dev Mode</div>
      <button onClick={() => onNavigate('home')} className="block">Home</button>
      <button onClick={() => onNavigate('auth')} className="block">Auth</button>
    </div>
  );
};

export default DevQuickAccess;
