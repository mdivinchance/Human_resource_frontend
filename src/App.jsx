import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// Pages
import Home from "./pages/Home";
import EmployeeRegister from "./pages/EmployeeRegister";
import Attendance from "./pages/Attendance";
import Contracts from "./pages/Contracts";
import ActiveContracts from "./pages/ActiveContracts";
import AttendanceRecords from "./pages/AttendanceRecords";
import Login from "./pages/Login";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Shared data
  const [employees, setEmployees] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);

  // Load login state from localStorage when app starts
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // 🔹 Handle login
  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true); // update React state instantly
  };

  // 🔹 Handle logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false); // instantly switch UI to Login
  };

  return (
    <Router>
      {isLoggedIn ? (
        <div className="flex h-screen bg-vscode-bg">
          {/* Pass handleLogout to Sidebar */}
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
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <Routes>
          {/* Pass handleLogin to Login */}
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
