import React, { useState } from "react";
import { FaEdit, FaTrash, FaEye, FaDownload, FaTimes } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Attendance = () => {
  const [attendanceList, setAttendanceList] = useState([
    { id: 1, employeeName: "Alice Johnson", date: "2025-10-22", status: "Present", remarks: "On time" },
    { id: 2, employeeName: "David Smith", date: "2025-10-22", status: "Late", remarks: "Arrived 15 mins late" },
    { id: 3, employeeName: "Sophia Brown", date: "2025-10-22", status: "Absent", remarks: "Sick leave" },
    { id: 4, employeeName: "John Doe", date: "2025-10-23", status: "On Leave", remarks: "Personal trip" },
  ]);

  const [formData, setFormData] = useState({
    employeeName: "",
    date: "",
    status: "Present",
    remarks: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add or update attendance
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.employeeName || !formData.date) return;

    if (isEditing) {
      // Update record
      setAttendanceList((prev) =>
        prev.map((record) =>
          record.id === editId ? { ...record, ...formData } : record
        )
      );
      setIsEditing(false);
      setEditId(null);
    } else {
      // Add new record
      const newRecord = {
        id: attendanceList.length + 1,
        ...formData,
      };
      setAttendanceList((prev) => [...prev, newRecord]);
    }

    setFormData({ employeeName: "", date: "", status: "Present", remarks: "" });
  };

  // Delete attendance
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setAttendanceList((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // View attendance
  const handleView = (record) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  // Populate form to edit record
  const handleEdit = (record) => {
    setFormData({
      employeeName: record.employeeName,
      date: record.date,
      status: record.status,
      remarks: record.remarks,
    });
    setIsEditing(true);
    setEditId(record.id);
  };

  // Download single record PDF
  const handleDownloadSinglePDF = (record) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Attendance Record", 14, 16);
    doc.text(`Employee: ${record.employeeName}`, 14, 30);
    doc.text(`Date: ${record.date}`, 14, 40);
    doc.text(`Status: ${record.status}`, 14, 50);
    doc.text(`Remarks: ${record.remarks || "None"}`, 14, 60);
    doc.save(`${record.employeeName}_attendance.pdf`);
  };

  // Download all attendance PDF
  const handleDownloadAllPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Attendance Report", 14, 16);

    const tableColumn = ["#", "Employee Name", "Date", "Status", "Remarks"];
    const tableRows = attendanceList.map((r) => [
      r.id,
      r.employeeName,
      r.date,
      r.status,
      r.remarks || "-",
    ]);

    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 25 });
    doc.save("attendance_report.pdf");
  };

  return (
    <div className="p-6 bg-vscode-bg text-vscode-text min-h-screen relative">
      <h1 className="text-2xl font-semibold mb-6 text-vscode-accent">
        Attendance Management
      </h1>

      {/* Download All Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownloadAllPDF}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          <FaDownload />
          <span>Download All</span>
        </button>
      </div>

      {/* Employee Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-vscode-bg-light p-6 rounded-lg shadow-vscode border border-vscode-border mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Employee Name</label>
            <input
              type="text"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleChange}
              className="form-input w-full"
              placeholder="Enter employee name"
              required
            />
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
              <option value="On Leave">On Leave</option>
              <option value="Late">Late</option>
            </select>
          </div>

          <div>
            <label className="form-label">Remarks</label>
            <input
              type="text"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="form-input w-full"
              placeholder="Optional remarks..."
            />
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

      {/* Attendance Table */}
      <div className="card">
        <div className="card-header text-lg font-semibold">
          Attendance Records
        </div>
        <div className="card-body overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Employee Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Remarks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {attendanceList.length > 0 ? (
                attendanceList.map((record) => (
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td>{record.employeeName}</td>
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
                    <td>{record.remarks}</td>
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
                  <td
                    colSpan="6"
                    className="text-center text-vscode-text-muted py-4"
                  >
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
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
              <p><strong>Employee:</strong> {selectedRecord.employeeName}</p>
              <p><strong>Date:</strong> {selectedRecord.date}</p>
              <p><strong>Status:</strong> {selectedRecord.status}</p>
              <p><strong>Remarks:</strong> {selectedRecord.remarks || "None"}</p>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
              >
                Close
              </button>
              <button
                onClick={() => handleDownloadSinglePDF(selectedRecord)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center space-x-2"
              >
                <FaDownload />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
