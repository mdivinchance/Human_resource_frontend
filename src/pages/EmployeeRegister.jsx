import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye, FaTimes, FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-hot-toast";
import api from "../api/axios";

const EmployeeRegister = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    idNumber: "",
    dob: "",
    qualification: "",
    departmentId: { id: "", name: "" },
    position: "",
    email: "",
    phoneNumber: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [viewEmployee, setViewEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  // ✅ Fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employee/all");
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to load employees!");
    }
  };

  // ✅ Fetch departments
  const fetchDepartments = async () => {
    try {
      const res = await api.get("/dept");
      setDepartments(res.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to load departments!");
    }
  };

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "departmentId") {
      const selectedDept = departments.find((d) => d.id === parseInt(value));
      setFormData((prev) => ({
        ...prev,
        departmentId: selectedDept || { id: "", name: "" },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      dob: formData.dob ? new Date(formData.dob).toISOString() : null,
    };

    try {
      if (editingId) {
        await api.put("/employee", payload);
        toast.success("Employee updated successfully!");
      } else {
        await api.post("/employee", payload);
        toast.success("Employee added successfully!");
      }
      setFormData({
        firstname: "",
        lastname: "",
        idNumber: "",
        dob: "",
        qualification: "",
        departmentId: { id: "", name: "" },
        position: "",
        email: "",
        phoneNumber: "",
      });
      setEditingId(null);
      fetchEmployees();
    } catch (error) {
      console.error("Error saving employee:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to save employee!");
    }
  };

  // ✅ Edit employee
  const handleEdit = (emp) => {
    setFormData(emp);
    setEditingId(emp.id);
  };

  // ✅ Delete employee
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await api.delete(`/employee/${id}`);
        toast.success("Employee deleted successfully!");
        fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error);
        toast.error("Failed to delete employee!");
      }
    }
  };

  // ✅ View details
  const handleView = (emp) => setViewEmployee(emp);
  const closeViewPopup = () => setViewEmployee(null);

  // ✅ Download employees as PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Employees Report", 14, 16);

    const tableColumn = [
      "#",
      "Full Name",
      "ID Number",
      "Department",
      "Position",
      "Email",
      "Phone",
    ];

    const tableRows = employees.map((emp, i) => [
      i + 1,
      `${emp.firstname} ${emp.lastname}`,
      emp.idNumber,
      emp.departmentId?.name || "—",
      emp.position,
      emp.email,
      emp.phoneNumber,
    ]);

    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 25 });
    doc.save("employees_report.pdf");
    toast.success("📄 Employees report downloaded!");
  };

  return (
    <div className="p-6 bg-vscode-bg text-vscode-text min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-vscode-accent">
        Employee Management
      </h1>

      {/* Download Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          <FaDownload /> <span>Download All</span>
        </button>
      </div>

      {/* Employee Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-vscode-bg-light p-6 rounded-lg shadow-vscode border border-vscode-border mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            placeholder="First Name"
            className="form-input"
            required
          />
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            placeholder="Last Name"
            className="form-input"
            required
          />
          <input
            type="text"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            placeholder="National ID"
            className="form-input"
          />
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="form-input"
          />
          <input
            type="text"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            placeholder="Qualification"
            className="form-input"
          />
          <select
            name="departmentId"
            value={formData.departmentId.id}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            placeholder="Position"
            className="form-input"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="form-input"
          />
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="form-input"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="btn-accent px-6 py-2 font-semibold text-white rounded-md"
          >
            {editingId ? "Update Employee" : "Add Employee"}
          </button>
        </div>
      </form>

      {/* Employee Table */}
      <div className="card overflow-x-auto">
        <div className="card-header text-lg font-semibold">
          Employees List
        </div>
        <div className="card-body">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>ID</th>
                <th>Department</th>
                <th>Position</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((emp, i) => (
                  <tr key={emp.id}>
                    <td>{i + 1}</td>
                    <td>{emp.firstname} {emp.lastname}</td>
                    <td>{emp.idNumber}</td>
                    <td>{emp.departmentId?.name || "—"}</td>
                    <td>{emp.position}</td>
                    <td>{emp.email}</td>
                    <td>{emp.phoneNumber}</td>
                    <td className="flex items-center space-x-3">
                      <button
                        onClick={() => handleView(emp)}
                        className="text-blue-400 hover:text-blue-600"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(emp)}
                        className="text-yellow-400 hover:text-yellow-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewEmployee && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-vscode-bg-light p-6 rounded-lg w-96 border border-vscode-border shadow-lg relative">
            <button
              onClick={closeViewPopup}
              className="absolute top-2 right-2 text-vscode-text-muted hover:text-red-500"
            >
              <FaTimes />
            </button>
            <h2 className="text-lg font-semibold mb-4 text-vscode-accent">
              Employee Details
            </h2>

            <div className="space-y-2">
              <p><strong>Name:</strong> {viewEmployee.firstname} {viewEmployee.lastname}</p>
              <p><strong>ID Number:</strong> {viewEmployee.idNumber}</p>
              <p><strong>Department:</strong> {viewEmployee.departmentId?.name}</p>
              <p><strong>Position:</strong> {viewEmployee.position}</p>
              <p><strong>Email:</strong> {viewEmployee.email}</p>
              <p><strong>Phone:</strong> {viewEmployee.phoneNumber}</p>
              <p><strong>Qualification:</strong> {viewEmployee.qualification}</p>
              <p><strong>DOB:</strong> {viewEmployee.dob?.split("T")[0]}</p>
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

export default EmployeeRegister;
