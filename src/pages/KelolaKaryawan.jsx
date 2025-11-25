import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { Pagination } from "../components/Pagination";
import { EmployeeModal } from "../components/EmployeeModal";
import { useEmployees } from "../hooks/useEmployees";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaUsers } from "react-icons/fa";

export default function KelolaKaryawan() {
  const navigate = useNavigate();
  const {
    employees,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  } = useEmployees();

  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleAddNew = () => {
    setEditingEmployee(null);
    setShowEmployeeModal(true);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowEmployeeModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus karyawan ini?")) {
      deleteEmployee(id);
    }
  };

  const handleSaveEmployee = (employeeData) => {
    if (editingEmployee) {
      updateEmployee(employeeData);
    } else {
      addEmployee(employeeData);
    }
    setShowEmployeeModal(false);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 flex flex-col ml-56 overflow-hidden">
        <Header username="JoeMama" />

        <div className="flex-1 p-4 overflow-auto flex flex-col">
          {/* Page Title */}
          <div className="mb-4 flex items-center gap-2">
            <div className="bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] p-2 rounded-lg shadow-md">
              <FaUsers className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Kelola Karyawan
            </h1>
          </div>

          {/* Search and Add Button */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari karyawan berdasarkan nama, email, atau posisi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl outline-none focus:border-[#1a509a] focus:ring-2 focus:ring-blue-100 transition-all text-sm"
              />
            </div>
            <button
              onClick={handleAddNew}
              className="bg-gradient-to-r from-[#5cb338] to-[#4d9a2e] text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all font-semibold flex items-center gap-2 text-sm"
            >
              <FaPlus className="w-4 h-4" />
              Tambah Karyawan
            </button>
          </div>

          {/* Employee Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex-1 flex flex-col">
            <div
              className="overflow-auto flex-1"
              style={{ minHeight: "400px" }}
            >
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] sticky top-0">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-bold text-white uppercase">
                      No
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-white uppercase">
                      Nama
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-white uppercase">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-white uppercase">
                      Telepon
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-white uppercase">
                      Alamat
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-white uppercase">
                      Posisi
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-white uppercase">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee, index) => (
                    <tr
                      key={employee.id}
                      className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {(currentPage - 1) * 7 + index + 1}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-800">
                        {employee.nama}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {employee.email}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {employee.telepon}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                        {employee.alamat}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full font-semibold text-xs ${
                            employee.posisi === "Admin"
                              ? "bg-purple-100 text-purple-700"
                              : employee.posisi === "Manager"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {employee.posisi}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(employee)}
                            className="bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:shadow-md transition-all flex items-center gap-1.5"
                          >
                            <FaEdit className="w-3 h-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(employee.id)}
                            className="bg-gradient-to-r from-[#d84040] to-[#c23636] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:shadow-md transition-all flex items-center gap-1.5"
                          >
                            <FaTrash className="w-3 h-3" />
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Employee Modal */}
      {showEmployeeModal && (
        <EmployeeModal
          employee={editingEmployee}
          onClose={() => setShowEmployeeModal(false)}
          onSave={handleSaveEmployee}
        />
      )}
    </div>
  );
}
