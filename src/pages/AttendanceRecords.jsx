import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye, FaDownload, FaTimes } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-hot-toast";
import api from "../api/axios";

const Attendance = () => {
  const todayDate = new Date().toISOString().split("T")[0];

  const [attendanceList, setAttendanceList] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    employeeId: "",
    date: todayDate,
    status: "Present",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employee/all");
      console.log("Employees fetched:", res.data);
      setEmployees(res.data);
    } catch (error) {
      console.error(" Error fetching employees:", error);
      toast.error("Failed to load employees");
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await api.get("/attandance/all");
      console.log("✅ Attendance fetched:", res.data);
      setAttendanceList(res.data);
    } catch (error) {
      console.error(" Error fetching attendance:", error);
      toast.error("Failed to load attendance records");
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "date" && value !== todayDate) {
      toast.error(" Attendance date must be today");
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.employeeId || !formData.date) {
      toast.error(" Please select employee and date");
      return;
    }

    if (formData.date !== todayDate) {
      toast.error(" You can only record attendance for today");
      return;
    }

    try {
      if (isEditing) {
        await api.put("/attandance", {
          id: editId,
          employeeId: formData.employeeId,
          date: formData.date,
          status: formData.status,
        });
        toast.success(" Attendance updated successfully");
      } else {
        await api.post("/attandance", formData);
        toast.success(" Attendance added successfully");
      }

      setFormData({ employeeId: "", date: todayDate, status: "Present" });
      setIsEditing(false);
      setEditId(null);
      fetchAttendance(); 
    } catch (error) {
      console.error(" Error saving attendance:", error);
      toast.error("Failed to save attendance");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await api.delete(`/attandance/${id}`);
        toast.success(" Attendance deleted successfully");
        fetchAttendance();
      } catch (error) {
        console.error(" Error deleting attendance:", error);
        toast.error("Failed to delete attendance");
      }
    }
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  const handleEdit = (record) => {
    setFormData({
      employeeId: record.employee.id,
      date: record.date,
      status: record.status,
    });
    setIsEditing(true);
    setEditId(record.id);
  };

  const handleDownloadSinglePDF = (record) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Attendance Record", 14, 16);
    doc.text(`Employee: ${record.employee.firstname} ${record.employee.lastname}`, 14, 30);
    doc.text(`Date: ${record.date}`, 14, 40);
    doc.text(`Status: ${record.status}`, 14, 50);
    doc.save(`${record.employee.firstname}_attendance.pdf`);
    toast.success(`📄 PDF downloaded for ${record.employee.firstname}`);
  };

  const handleDownloadAllPDF = () => {
    const todayRecords = attendanceList.filter((r) => r.date === todayDate);
    if (todayRecords.length === 0) {
      toast.error(" No attendance recorded for today");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Today's Attendance Report", 14, 16);

    const tableColumn = ["#", "Employee Name", "Date", "Status"];
    const tableRows = todayRecords.map((r, i) => [
      i + 1,
      `${r.employee.firstname} ${r.employee.lastname}`,
      r.date,
      r.status,
    ]);

    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 25 });
    doc.save("attendance_today_report.pdf");
    toast.success(" Today's attendance report downloaded!");
  };

  return (
    <div className="p-6 bg-vscode-bg text-vscode-text min-h-screen relative">
      <h1 className="text-2xl font-semibold mb-6 text-vscode-accent">
        Attendance Management
      </h1>

      

      <form
        onSubmit={handleSubmit}
        className="bg-vscode-bg-light p-6 rounded-lg shadow-vscode border border-vscode-border mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Employee</label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              className="form-input w-full"
              required
            >
              <option value="">Select employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstname} {emp.lastname}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input w-full"
              required
              max={todayDate}
            />
          </div>

          <div>
            <label className="form-label">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-input w-full"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="btn-accent px-6 py-2 font-semibold text-white rounded-md"
          >
            {isEditing ? "Update Attendance" : "Add Attendance"}
          </button>
        </div>
      </form>

      <div className="card overflow-x-auto">
        <div className="card-header text-lg font-semibold">Attendance Records</div>
        <div className="card-body">
          <table className="table w-full min-w-[700px] md:min-w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Employee</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {attendanceList.length > 0 ? (
                attendanceList.map((record, index) => (
                  <tr key={record.id}>
                    <td>{index + 1}</td>
                    <td>
                      {record.employee?.firstname} {record.employee?.lastname}
                    </td>
                    <td>{record.date}</td>
                    <td
                      className={
                        record.status === "Present"
                          ? "text-green-400"
                          : record.status === "Absent"
                          ? "text-red-400"
                          : record.status === "Late"
                          ? "text-yellow-400"
                          : "text-blue-400"
                      }
                    >
                      {record.status}
                    </td>
                    <td className="flex items-center space-x-3">
                      <button
                        onClick={() => handleView(record)}
                        className="text-blue-400 hover:text-blue-600"
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(record)}
                        className="text-yellow-400 hover:text-yellow-600"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-400">
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showViewModal && selectedRecord && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-vscode-bg-light p-6 rounded-lg w-96 border border-vscode-border shadow-lg relative">
            <button
              onClick={() => setShowViewModal(false)}
              className="absolute top-2 right-2 text-vscode-text-muted hover:text-red-500"
            >
              <FaTimes />
            </button>
            <h2 className="text-lg font-semibold mb-4 text-vscode-accent">
              Attendance Details
            </h2>
            <div className="space-y-2 text-sm">
              <p><strong>Employee:</strong> {selectedRecord.employee?.firstname} {selectedRecord.employee?.lastname}</p>
              <p><strong>Date:</strong> {selectedRecord.date}</p>
              <p><strong>Status:</strong> {selectedRecord.status}</p>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
