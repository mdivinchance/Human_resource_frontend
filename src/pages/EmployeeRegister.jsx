import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const EmployeeRegister = () => {
  // Sample employee data
  const [employees, setEmployees] = useState([
    { id: 1, firstName: "Alice", lastName: "Johnson", department: "HR", position: "Manager", email: "alice.johnson@example.com" },
    { id: 2, firstName: "David", lastName: "Smith", department: "IT", position: "Developer", email: "david.smith@example.com" },
    { id: 3, firstName: "Sophia", lastName: "Brown", department: "Sales", position: "Sales Rep", email: "sophia.brown@example.com" },
  ]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    department: "",
    position: "",
    email: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName) return;

    if (isEditing) {
      // Update existing employee
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === editId ? { ...emp, ...formData } : emp
        )
      );
      setIsEditing(false);
      setEditId(null);
    } else {
      // Add new employee
      const newEmployee = {
        id: employees.length + 1,
        ...formData,
      };
      setEmployees((prev) => [...prev, newEmployee]);
    }

    setFormData({ firstName: "", lastName: "", department: "", position: "", email: "" });
  };

  const handleEdit = (emp) => {
    setFormData({
      firstName: emp.firstName,
      lastName: emp.lastName,
      department: emp.department,
      position: emp.position,
      email: emp.email,
    });
    setIsEditing(true);
    setEditId(emp.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    }
  };

  return (
    <div className="p-6 bg-vscode-bg text-vscode-text min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-vscode-accent">Employee Register</h1>

      {/* Employee Form */}
      <form onSubmit={handleSubmit} className="bg-vscode-bg-light p-6 rounded-lg shadow-vscode border border-vscode-border mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter first name"
              required
            />
          </div>

          <div>
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter last name"
              required
            />
          </div>

          <div>
            <label className="form-label">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. IT, Sales"
            />
          </div>

          <div>
            <label className="form-label">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Manager, Developer"
            />
          </div>

          <div className="md:col-span-2">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter employee email"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="btn-accent px-6 py-2 font-semibold text-white rounded-md"
          >
            {isEditing ? "Update Employee" : "Register Employee"}
          </button>
        </div>
      </form>

      {/* Employee Table */}
      <div className="card">
        <div className="card-header text-lg font-semibold">Employee List</div>
        <div className="card-body overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Department</th>
                <th>Position</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td>
                    <td>{emp.firstName}</td>
                    <td>{emp.lastName}</td>
                    <td>{emp.department}</td>
                    <td>{emp.position}</td>
                    <td>{emp.email}</td>
                    <td className="flex items-center space-x-3">
                      <button
                        onClick={() => handleEdit(emp)}
                        className="text-yellow-400 hover:text-yellow-600"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
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
                    No employees registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeRegister;
