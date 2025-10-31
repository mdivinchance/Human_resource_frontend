import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../api/axios";

const Home = () => {
  const [totals, setTotals] = useState({
    totalEmployee: 0,
    totalActiveContract: 0,
    totalInactiveContract: 0,
    totalPresent: 0,
    totalLate: 0,
    totalAbsent: 0
  });

  useEffect(() => {
    fetchDashboardTotals();
  }, []);

  const fetchDashboardTotals = async () => {
    try {
      const res = await api.get("/dashboard");
      if (res.data && res.data.length > 0) {
        setTotals(res.data[0]); // Use the first object with totals
      }
    } catch (error) {
      console.error("Error fetching dashboard totals:", error);
      toast.error("Failed to fetch dashboard data");
    }
  };

  return (
    <div className="p-8 bg-vscode-bg min-h-screen text-vscode-text">
      <h1 className="text-3xl font-bold text-vscode-accent mb-8">
        Human Resource Dashboard
      </h1>

      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 text-center hover:scale-[1.02] transition-transform duration-300">
          <h2 className="text-lg font-semibold text-vscode-text-muted mb-2">
            Total Employees
          </h2>
          <p className="text-4xl font-bold text-vscode-accent">{totals.totalEmployee}</p>
        </div>

        <div className="card p-6 text-center hover:scale-[1.02] transition-transform duration-300">
          <h2 className="text-lg font-semibold text-vscode-text-muted mb-2">
            Contracts Summary
          </h2>
          <div className="flex justify-around mt-2">
            <div>
              <p className="text-sm text-green-400 font-medium">Active</p>
              <p className="text-2xl font-bold">{totals.totalActiveContract}</p>
            </div>
            <div>
              <p className="text-sm text-red-400 font-medium">Inactive</p>
              <p className="text-2xl font-bold">{totals.totalInactiveContract}</p>
            </div>
          </div>
        </div>

        <div className="card p-6 text-center hover:scale-[1.02] transition-transform duration-300">
          <h2 className="text-lg font-semibold text-vscode-text-muted mb-2">
            Attendance Summary
          </h2>
          <div className="flex justify-around mt-2">
            <div>
              <p className="text-sm text-green-400 font-medium">Present</p>
              <p className="text-2xl font-bold">{totals.totalPresent}</p>
            </div>
            <div>
              <p className="text-sm text-yellow-400 font-medium">Late</p>
              <p className="text-2xl font-bold">{totals.totalLate}</p>
            </div>
            <div>
              <p className="text-sm text-red-400 font-medium">Absent</p>
              <p className="text-2xl font-bold">{totals.totalAbsent}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
