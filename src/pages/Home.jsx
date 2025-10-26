import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaDownload, FaTimes } from "react-icons/fa";

const Home = () => {
  const [employees, setEmployees] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);

  // Form states
  const [contractForm, setContractForm] = useState({
    employeeId: "",
    contractType: "Full-Time",
    startDate: "",
    endDate: "",
    status: "Active",
  });

  const [attendanceForm, setAttendanceForm] = useState({
    employeeId: "",
    date: "",
    status: "Present",
    remarks: "",
  });

  // Sample employees
  useEffect(() => {
    setEmployees([
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
      { id: 3, name: "Charlie" },
      { id: 4, name: "Diana" },
    ]);
  }, []);

  // 🔹 Handle Contract Form
  const handleContractChange = (e) => {
    const { name, value } = e.target;
    setContractForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContractSubmit = (e) => {
    e.preventDefault();
    if (!contractForm.employeeId || !contractForm.startDate) return;

    const newContract = {
      id: contracts.length + 1,
      employeeName: employees.find((e) => e.id === Number(contractForm.employeeId)).name,
      ...contractForm,
    };

    setContracts((prev) => [...prev, newContract]);
    setContractForm({ employeeId: "", contractType: "Full-Time", startDate: "", endDate: "", status: "Active" });
  };

  // 🔹 Handle Attendance Form
  const handleAttendanceChange = (e) => {
    const { name, value } = e.target;
    setAttendanceForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAttendanceSubmit = (e) => {
    e.preventDefault();
    if (!attendanceForm.employeeId || !attendanceForm.date) return;

    const newAttendance = {
      id: attendance.length + 1,
      employeeName: employees.find((e) => e.id === Number(attendanceForm.employeeId)).name,
      ...attendanceForm,
    };

    setAttendance((prev) => [...prev, newAttendance]);
    setAttendanceForm({ employeeId: "", date: "", status: "Present", remarks: "" });
  };

  // Summary calculations
  const totalEmployees = employees.length;
  const activeContracts = contracts.filter((c) => c.status === "Active").length;
  const nonActiveContracts = contracts.filter((c) => c.status !== "Active").length;
  const presentCount = attendance.filter((a) => a.status === "Present").length;
  const absentCount = attendance.filter((a) => a.status === "Absent").length;
  const lateCount = attendance.filter((a) => a.status === "Late").length;

  // 🔹 Generate PDF Report
  const downloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("HR Report", 14, 16);

    // Contracts
    doc.setFontSize(14);
    doc.text("Active Contracts", 14, 26);
    const contractRows = contracts
      .filter((c) => c.status === "Active")
      .map((c, idx) => [idx + 1, c.employeeName, c.contractType, c.startDate, c.endDate || "-", c.status]);
    doc.autoTable({
      head: [["#", "Employee Name", "Type", "Start Date", "End Date", "Status"]],
      body: contractRows,
      startY: 30,
    });

    // Attendance
    const finalY = doc.lastAutoTable.finalY + 10 || 50;
    doc.setFontSize(14);
    doc.text("Attendance Records", 14, finalY);
    const attendanceRows = attendance.map((a) => [a.id, a.employeeName, a.date, a.status, a.remarks || "-"]);
    doc.autoTable({
      head: [["#", "Employee Name", "Date", "Status", "Remarks"]],
      body: attendanceRows,
      startY: finalY + 4,
    });

    doc.save("hr_report.pdf");
    setShowReportModal(false);
  };

  return (
    <div className="p-8 bg-vscode-bg min-h-screen text-vscode-text">
      <h1 className="text-3xl font-bold text-vscode-accent mb-8">Human Resource Dashboard</h1>

      {/* Dashboard Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 text-center hover:scale-[1.02] transition-transform duration-300">
          <h2 className="text-lg font-semibold text-vscode-text-muted mb-2">Total Employees</h2>
          <p className="text-4xl font-bold text-vscode-accent">{totalEmployees}</p>
        </div>

        <div className="card p-6 text-center hover:scale-[1.02] transition-transform duration-300">
          <h2 className="text-lg font-semibold text-vscode-text-muted mb-2">Contracts Summary</h2>
          <div className="flex justify-around mt-2">
            <div>
              <p className="text-sm text-green-400 font-medium">Active</p>
              <p className="text-2xl font-bold">{activeContracts}</p>
            </div>
            <div>
              <p className="text-sm text-red-400 font-medium">Inactive</p>
              <p className="text-2xl font-bold">{nonActiveContracts}</p>
            </div>
          </div>
        </div>

        <div className="card p-6 text-center hover:scale-[1.02] transition-transform duration-300">
          <h2 className="text-lg font-semibold text-vscode-text-muted mb-2">Attendance Summary</h2>
          <div className="flex justify-around mt-2">
            <div>
              <p className="text-sm text-green-400 font-medium">Present</p>
              <p className="text-2xl font-bold">{presentCount}</p>
            </div>
            <div>
              <p className="text-sm text-yellow-400 font-medium">Late</p>
              <p className="text-2xl font-bold">{lateCount}</p>
            </div>
            <div>
              <p className="text-sm text-red-400 font-medium">Absent</p>
              <p className="text-2xl font-bold">{absentCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview + Generate Report */}
      <div className="card p-6 relative mb-8">
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <p className="text-vscode-text-muted mb-4">
          This dashboard summarizes employee, contract, and attendance data. You can assign contracts and attendance to employees below.
        </p>
        <button
          onClick={() => setShowReportModal(true)}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          <FaDownload />
          <span>Generate Report</span>
        </button>
      </div>

      {/* 🔹 Contract Form */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Add Contract</h2>
        <form onSubmit={handleContractSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="employeeId"
            value={contractForm.employeeId}
            onChange={handleContractChange}
            className="form-input"
          >
            <option value="">Select Employee</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
          <select name="contractType" value={contractForm.contractType} onChange={handleContractChange} className="form-input">
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Temporary">Temporary</option>
            <option value="Internship">Internship</option>
          </select>
          <input type="date" name="startDate" value={contractForm.startDate} onChange={handleContractChange} className="form-input"/>
          <input type="date" name="endDate" value={contractForm.endDate} onChange={handleContractChange} className="form-input"/>
          <select name="status" value={contractForm.status} onChange={handleContractChange} className="form-input">
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
            <option value="Terminated">Terminated</option>
          </select>
          <button type="submit" className="btn-accent px-6 py-2 text-white rounded-md col-span-1 md:col-span-2">Add Contract</button>
        </form>
      </div>

      {/* 🔹 Attendance Form */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Add Attendance</h2>
        <form onSubmit={handleAttendanceSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="employeeId"
            value={attendanceForm.employeeId}
            onChange={handleAttendanceChange}
            className="form-input"
          >
            <option value="">Select Employee</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
          <input type="date" name="date" value={attendanceForm.date} onChange={handleAttendanceChange} className="form-input"/>
          <select name="status" value={attendanceForm.status} onChange={handleAttendanceChange} className="form-input">
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
            <option value="On Leave">On Leave</option>
          </select>
          <input type="text" name="remarks" value={attendanceForm.remarks} onChange={handleAttendanceChange} placeholder="Remarks" className="form-input"/>
          <button type="submit" className="btn-accent px-6 py-2 text-white rounded-md col-span-1 md:col-span-2">Add Attendance</button>
        </form>
      </div>

      {/* 🔹 Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-vscode-bg-light p-6 rounded-lg w-96 border border-vscode-border shadow-lg relative">
            <button onClick={() => setShowReportModal(false)} className="absolute top-2 right-2 text-vscode-text-muted hover:text-red-500">
              <FaTimes />
            </button>
            <h2 className="text-lg font-semibold mb-4 text-vscode-accent">HR Report Preview</h2>
            <p className="text-sm text-vscode-text-muted mb-4">
              Report includes <strong>{contracts.filter(c => c.status === "Active").length}</strong> active contracts and <strong>{attendance.length}</strong> attendance records.
            </p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowReportModal(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md">Cancel</button>
              <button onClick={downloadReport} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center space-x-2">
                <FaDownload /><span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
