import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUserPlus,
  FaFileContract,
  FaCalendarCheck,
} from "react-icons/fa";

const Sidebar = ({ isOpen, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      path: "/",
      name: "Dashboard",
      icon: <FaHome className="w-5 h-5" />,
    },
    {
      path: "/register",
      name: "Employee Registration",
      icon: <FaUserPlus className="w-5 h-5" />,
    },
    {
      path: "/contracts",
      name: "Contracts",
      icon: <FaFileContract className="w-5 h-5" />,
    },
    {
      path: "/attendance-records",
      name: "Attendance Records",
      icon: <FaCalendarCheck className="w-5 h-5" />,
    },
  ];

  const isActive = (path) => location.pathname === path;

  // 🔹 Logout handler (redirects immediately)
  const handleLogout = () => {
    onLogout(); // update App state instantly
    navigate("/login", { replace: true }); // redirect without refresh
  };

  return (
    <div
      className={`sidebar h-full flex flex-col bg-vscode-bg transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-vscode-border">
        {isOpen ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-vscode-accent rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-vscode-text">
                HR System
              </h2>
              <p className="text-xs text-vscode-text-muted">
                Employee Management
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-vscode-accent rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
              ${
                isActive(item.path)
                  ? "bg-vscode-accent text-white"
                  : "text-vscode-text-muted hover:text-vscode-text hover:bg-vscode-bg-lighter"
              }
              ${!isOpen ? "justify-center" : ""}`}
            title={!isOpen ? item.name : ""}
          >
            {item.icon}
            {isOpen && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-vscode-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
            />
          </svg>
          {isOpen && <span>Logout</span>}
        </button>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-vscode-border">
        {isOpen ? (
          <div className="text-xs text-vscode-text-muted space-y-1">
            <p className="font-medium">HR System v1.0</p>
            <p>Kigali, Rwanda</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-6 h-6 bg-vscode-bg-lighter rounded flex items-center justify-center">
              <span className="text-xs text-vscode-text-muted">🇷🇼</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
