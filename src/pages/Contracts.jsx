import React, { useState } from "react";
import { FaEdit, FaTrash, FaEye, FaDownload, FaTimes } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Contract = () => {
  // Sample contract data
  const [contracts, setContracts] = useState([
    {
      id: 1,
      employeeName: "Alice Johnson",
      contractType: "Full-Time",
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      status: "Active",
    },
    {
      id: 2,
      employeeName: "David Smith",
      contractType: "Part-Time",
      startDate: "2025-02-15",
      endDate: "2025-08-15",
      status: "Active",
    },
    {
      id: 3,
      employeeName: "Sophia Brown",
      contractType: "Internship",
      startDate: "2025-06-01",
      endDate: "2025-09-30",
      status: "Expired",
    },
  ]);

  const [formData, setFormData] = useState({
    employeeName: "",
    contractType: "",
    startDate: "",
    endDate: "",
    status: "Active",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [viewContract, setViewContract] = useState(null); // For view popup

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Add / Update
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.employeeName || !formData.contractType || !formData.startDate)
      return;

    if (isEditing) {
      setContracts((prev) =>
        prev.map((c) => (c.id === editId ? { ...c, ...formData } : c))
      );
      setIsEditing(false);
      setEditId(null);
    } else {
      const newContract = {
        id: contracts.length + 1,
        ...formData,
      };
      setContracts((prev) => [...prev, newContract]);
    }

    setFormData({
      employeeName: "",
      contractType: "",
      startDate: "",
      endDate: "",
      status: "Active",
    });
  };

  // Edit contract
  const handleEdit = (contract) => {
    setFormData({ ...contract });
    setIsEditing(true);
    setEditId(contract.id);
  };

  // Delete contract
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this contract?")) {
      setContracts((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // Open view popup
  const handleView = (contract) => {
    setViewContract(contract);
  };

  // Close view popup
  const closeViewPopup = () => {
    setViewContract(null);
  };

  // Download all contracts as PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Contracts Report", 14, 16);

    const tableColumn = ["#", "Employee Name", "Contract Type", "Start Date", "End Date", "Status"];
    const tableRows = [];

    contracts.forEach((c) => {
      tableRows.push([
        c.id,
        c.employeeName,
        c.contractType,
        c.startDate,
        c.endDate || "-",
        c.status,
      ]);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 25,
    });

    doc.save("contracts_report.pdf");
  };

  return (
    <div className="p-6 bg-vscode-bg text-vscode-text min-h-screen relative">
      <h1 className="text-2xl font-semibold mb-6 text-vscode-accent">Contracts Management</h1>

      {/* Download Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          <FaDownload />
          <span>Download All</span>
        </button>
      </div>

      {/* Contract Form */}
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
              className="form-input"
              placeholder="Enter employee name"
              required
            />
          </div>

          <div>
            <label className="form-label">Contract Type</label>
            <select
              name="contractType"
              value={formData.contractType}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select contract type</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Temporary">Temporary</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div>
            <label className="form-label">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-input"
            >
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="btn-accent px-6 py-2 font-semibold text-white rounded-md"
          >
            {isEditing ? "Update Contract" : "Add Contract"}
          </button>
        </div>
      </form>

      {/* Contracts Table */}
      <div className="card">
        <div className="card-header text-lg font-semibold">Contracts List</div>
        <div className="card-body overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Employee Name</th>
                <th>Contract Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {contracts.length > 0 ? (
                contracts.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.employeeName}</td>
                    <td>{c.contractType}</td>
                    <td>{c.startDate}</td>
                    <td>{c.endDate || "N/A"}</td>
                    <td
                      className={
                        c.status === "Active"
                          ? "text-green-400"
                          : c.status === "Expired"
                          ? "text-yellow-400"
                          : "text-red-400"
                      }
                    >
                      {c.status}
                    </td>
                    <td className="flex items-center space-x-3">
                      <button
                        onClick={() => handleView(c)}
                        className="text-blue-400 hover:text-blue-600"
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(c)}
                        className="text-yellow-400 hover:text-yellow-600"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
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
                  <td colSpan="7" className="text-center text-vscode-text-muted py-4">
                    No contracts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔹 View Popup Modal */}
      {viewContract && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-vscode-bg-light p-6 rounded-lg w-96 border border-vscode-border shadow-lg relative">
            <button
              onClick={closeViewPopup}
              className="absolute top-2 right-2 text-vscode-text-muted hover:text-red-500"
            >
              <FaTimes />
            </button>

            <h2 className="text-lg font-semibold mb-4 text-vscode-accent">
              Contract Details
            </h2>

            <div className="space-y-2">
              <p><strong>Employee:</strong> {viewContract.employeeName}</p>
              <p><strong>Contract Type:</strong> {viewContract.contractType}</p>
              <p><strong>Start Date:</strong> {viewContract.startDate}</p>
              <p><strong>End Date:</strong> {viewContract.endDate || "N/A"}</p>
              <p><strong>Status:</strong> {viewContract.status}</p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeViewPopup}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contract;
