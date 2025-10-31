import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye, FaDownload, FaTimes } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-hot-toast";
import api from "../api/axios";

const Contract = () => {
  const [contracts, setContracts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    nationalId: "",
    contractNumber: "",
    salary: "",
    contractType: "",
    startDate: "",
    endDate: "",
    status: "Active",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [viewContract, setViewContract] = useState(null);

  // ✅ Fetch employees and contracts when component loads
  useEffect(() => {
    fetchEmployees();
    fetchContracts();
  }, []);

  // ✅ Fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employee/all");
      console.log("✅ Employees fetched:", res.data);
      setEmployees(res.data);
    } catch (error) {
      console.error("❌ Error fetching employees:", error);
      toast.error("Failed to load employees");
    }
  };

  // ✅ Fetch contracts
  const fetchContracts = async () => {
    try {
      const res = await api.get("/contract/all");
      console.log("✅ Contracts fetched:", res.data);
      setContracts(res.data);
    } catch (error) {
      console.error("❌ Error fetching contracts:", error);
      toast.error("Failed to load contracts");
    }
  };

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Auto-fill employee info
    if (name === "employeeId") {
      const selectedEmp = employees.find((emp) => emp.id === Number(value));
      if (selectedEmp) {
        setFormData((prev) => ({
          ...prev,
          employeeId: value,
          employeeName: `${selectedEmp.firstname} ${selectedEmp.lastname}`,
          nationalId: selectedEmp.idNumber,
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Add or update contract
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.employeeId ||
      !formData.contractNumber ||
      !formData.contractType ||
      !formData.startDate
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = {
      id: isEditing ? editId : undefined,
      employee: { id: Number(formData.employeeId) },
      contractCode: formData.contractNumber,
      contractType: formData.contractType,
      salary: parseFloat(formData.salary),
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
    };

    try {
      if (isEditing) {
        await api.put("/contract", payload);
        toast.success("Contract updated successfully");
      } else {
        await api.post("/contract", payload);
        toast.success("Contract added successfully");
      }

      // Reset form
      setIsEditing(false);
      setEditId(null);
      setFormData({
        employeeId: "",
        employeeName: "",
        nationalId: "",
        contractNumber: "",
        salary: "",
        contractType: "",
        startDate: "",
        endDate: "",
        status: "Active",
      });

      // Refresh list
      fetchContracts();
    } catch (error) {
      console.error("❌ Error saving contract:", error);
      toast.error("Failed to save contract");
    }
  };

  // ✅ Edit existing contract
  const handleEdit = (contract) => {
    setFormData({
      employeeId: contract.employee?.id || "",
      employeeName: `${contract.employee?.firstname || ""} ${contract.employee?.lastname || ""}`,
      nationalId: contract.employee?.idNumber || "",
      contractNumber: contract.contractCode,
      salary: contract.salary,
      contractType: contract.contractType,
      startDate: contract.startDate?.split("T")[0],
      endDate: contract.endDate?.split("T")[0],
      status: contract.status,
    });
    setIsEditing(true);
    setEditId(contract.id);
  };

  // ✅ Delete contract
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contract?")) {
      try {
        await api.delete(`/contract/${id}`);
        toast.success("Contract deleted successfully");
        fetchContracts();
      } catch (error) {
        console.error("❌ Error deleting contract:", error);
        toast.error("Failed to delete contract");
      }
    }
  };

  const handleView = (contract) => setViewContract(contract);
  const closeViewPopup = () => setViewContract(null);

  // ✅ Download contracts as PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Contracts Report", 14, 16);

    const tableColumn = [
      "#",
      "Employee Name",
      "National ID",
      "Contract No.",
      "Salary",
      "Contract Type",
      "Start Date",
      "End Date",
      "Status",
    ];

    const tableRows = contracts.map((c, i) => [
      i + 1,
      `${c.employee?.firstname || ""} ${c.employee?.lastname || ""}`,
      c.employee?.idNumber,
      c.contractCode,
      c.salary,
      c.contractType,
      c.startDate?.split("T")[0],
      c.endDate?.split("T")[0] || "-",
      c.status,
    ]);

    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 25 });
    doc.save("contracts_report.pdf");
    toast.success("📄 Contracts report downloaded!");
  };

  return (
    <div className="p-6 bg-vscode-bg text-vscode-text min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-vscode-accent">
        Contracts Management
      </h1>

      

      {/* Contract Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-vscode-bg-light p-6 rounded-lg shadow-vscode border border-vscode-border mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Select Employee</label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              className="form-input w-full"
              required
            >
              <option value="">-- Select Employee --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstname} {emp.lastname}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">National ID</label>
            <input
              type="text"
              name="nationalId"
              value={formData.nationalId}
              onChange={handleChange}
              className="form-input"
              disabled
            />
          </div>

          <div>
            <label className="form-label">Contract Number</label>
            <input
              type="text"
              name="contractNumber"
              value={formData.contractNumber}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. C-003"
              required
            />
          </div>

          <div>
            <label className="form-label">Salary</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. 1000000"
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
              <option value="Inactive">Inactive</option>
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
      <div className="card overflow-x-auto">
        <div className="card-header text-lg font-semibold">Contracts List</div>
        <div className="card-body">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Employee</th>
                <th>National ID</th>
                <th>Contract No.</th>
                <th>Salary</th>
                <th>Type</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contracts.length > 0 ? (
                contracts.map((c, i) => (
                  <tr key={c.id}>
                    <td>{i + 1}</td>
                    <td>{c.employee?.firstname} {c.employee?.lastname}</td>
                    <td>{c.employee?.idNumber}</td>
                    <td>{c.contractCode}</td>
                    <td>{c.salary}</td>
                    <td>{c.contractType}</td>
                    <td>{c.startDate?.split("T")[0]}</td>
                    <td>{c.endDate?.split("T")[0] || "N/A"}</td>
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
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(c)}
                        className="text-yellow-400 hover:text-yellow-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-4">
                    No contracts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Contract Modal */}
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
              <p><strong>Employee:</strong> {viewContract.employee?.firstname} {viewContract.employee?.lastname}</p>
              <p><strong>National ID:</strong> {viewContract.employee?.idNumber}</p>
              <p><strong>Contract No.:</strong> {viewContract.contractCode}</p>
              <p><strong>Salary:</strong> {viewContract.salary}</p>
              <p><strong>Contract Type:</strong> {viewContract.contractType}</p>
              <p><strong>Start Date:</strong> {viewContract.startDate?.split("T")[0]}</p>
              <p><strong>End Date:</strong> {viewContract.endDate?.split("T")[0]}</p>
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
