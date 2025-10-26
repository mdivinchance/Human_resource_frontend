
import React, { useEffect, useState } from 'react';

const Toast = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => handleClose(), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, 300);
  };

  if (!isVisible) return null;

  const getToastStyles = () => {
    const baseStyles = 'flex items-center p-4 rounded-lg shadow-md border';
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-vscode-success border-vscode-success text-white`;
      case 'error':
        return `${baseStyles} bg-vscode-error border-vscode-error text-white`;
      case 'warning':
        return `${baseStyles} bg-vscode-warning border-vscode-warning text-black`;
      case 'info':
      default:
        return `${baseStyles} bg-vscode-info border-vscode-info text-white`;
    }
  };

  const getIcon = () => {
    const iconClass = "w-5 h-5 mr-3 flex-shrink-0";
    switch (type) {
      case 'success':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01M4.93 19h14.14l-7.07-12L4.93 19z" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
          </svg>
        );
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`
          ${getToastStyles()}
          max-w-sm w-full transform transition-all duration-300 ease-in-out
          ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
        `}
      >
        {getIcon()}
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="ml-3 flex-shrink-0 text-white hover:text-gray-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;
