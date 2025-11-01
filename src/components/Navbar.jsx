import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ onToggleSidebar }) => {
  const location = useLocation();

  const getPageName = (pathname) => {
    switch (pathname) {
      case '/': return 'Home';
      case '/register': return 'Employee Registration';
      case '/attendance': return 'Attendance';
      case '/contracts': return 'Contracts';
      case '/active-contracts': return 'Active Contracts';
      case '/attendance-records': return 'Attendance Records';
      default: return 'HR System';
    }
  };

  return (
    <nav className="bg-vscode-sidebar border-b border-vscode-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md text-vscode-text-muted hover:text-vscode-text hover:bg-vscode-bg-lighter transition-colors "
            title="Toggle Sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/"
            className={`px-3 py-1 rounded-md transition-colors ${location.pathname === '/' ? 'bg-vscode-bg-lighter text-white' : 'text-vscode-text-muted hover:text-vscode-text hover:bg-vscode-bg-lighter'}`}
          >
            Dashboard
          </Link>
          <Link
            to="/register"
            className={`px-3 py-1 rounded-md transition-colors ${location.pathname === '/register' ? 'bg-vscode-bg-lighter text-white' : 'text-vscode-text-muted hover:text-vscode-text hover:bg-vscode-bg-lighter'}`}
          >
            Employee Registration
          </Link>
          
          <Link
            to="/contracts"
            className={`px-3 py-1 rounded-md transition-colors ${location.pathname === '/contracts' ? 'bg-vscode-bg-lighter text-white' : 'text-vscode-text-muted hover:text-vscode-text hover:bg-vscode-bg-lighter'}`}
          >
            Contracts
          </Link>
          
          <Link
            to="/attendance-records"
            className={`px-3 py-1 rounded-md transition-colors ${location.pathname === '/attendance-records' ? 'bg-vscode-bg-lighter text-white' : 'text-vscode-text-muted hover:text-vscode-text hover:bg-vscode-bg-lighter'}`}
          >
            Attendance Records
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:block text-sm text-vscode-text-muted">
            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
          </div>
        </div>
      </div>

      <div className="md:hidden mt-2 pt-2 border-t border-vscode-border">
        <span className="text-sm text-vscode-text-muted">{getPageName(location.pathname)}</span>
      </div>
    </nav>
  );
};

export default Navbar;
