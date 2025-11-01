import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import EmployeeRegister from "./pages/EmployeeRegister";
import Attendance from "./pages/Attendance";
import Contracts from "./pages/Contracts";
import ActiveContracts from "./pages/ActiveContracts";
import AttendanceRecords from "./pages/AttendanceRecords";
import Login from "./pages/Login";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-screen text-center">
    <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
    <p className="text-lg mb-6">Oops! Page Not Found.</p>
    <a
      href="/"
      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
    >
      Go Back Home
    </a>
  </div>
);

const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!loggedIn && location.pathname !== "/login") {
      navigate("/login");
    }

    if (loggedIn && location.pathname === "/login") {
      navigate("/");
    }
  }, [location, navigate]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {isLoggedIn ? (
        <div className="flex h-screen bg-gray-100">
          <Sidebar isOpen={sidebarOpen} onLogout={handleLogout} />
          <div className="flex-1 flex flex-col">
            <Navbar onToggleSidebar={toggleSidebar} />
            <main className="flex-1 overflow-auto p-6">
              <Routes>
                <Route
                  path="/"
                  element={
                    <Home
                      employees={employees}
                      contracts={contracts}
                      attendanceList={attendanceList}
                    />
                  }
                />
                <Route
                  path="/register"
                  element={
                    <EmployeeRegister
                      employees={employees}
                      setEmployees={setEmployees}
                    />
                  }
                />
                <Route
                  path="/attendance"
                  element={
                    <Attendance
                      employees={employees}
                      attendanceList={attendanceList}
                      setAttendanceList={setAttendanceList}
                    />
                  }
                />
                <Route
                  path="/contracts"
                  element={
                    <Contracts
                      employees={employees}
                      contracts={contracts}
                      setContracts={setContracts}
                    />
                  }
                />
                <Route
                  path="/active-contracts"
                  element={
                    <ActiveContracts
                      contracts={contracts}
                      setContracts={setContracts}
                    />
                  }
                />
                <Route
                  path="/attendance-records"
                  element={
                    <AttendanceRecords
                      attendanceList={attendanceList}
                      setAttendanceList={setAttendanceList}
                    />
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
