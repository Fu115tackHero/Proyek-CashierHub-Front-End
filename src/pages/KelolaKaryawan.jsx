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
    loading,
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
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleDelete = async (employee) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${employee.nama}?`)) {
      setIsProcessing(true);
      const result = await deleteEmployee(employee.id);
      setIsProcessing(false);

      if (result.success) {
        alert("Karyawan berhasil dihapus!");
      } else {
        alert("Gagal menghapus karyawan: " + result.error);
      }
    }
  };

  const handleSaveEmployee = async (employeeData) => {
    setIsProcessing(true);
    let result;

    if (editingEmployee) {
      result = await updateEmployee(employeeData);
    } else {
      result = await addEmployee(employeeData);
    }

    setIsProcessing(false);

    if (result.success) {
      alert(
        editingEmployee
          ? "Karyawan berhasil diupdate!"
          : "Karyawan berhasil ditambahkan!"
      );
      
      // Update localStorage jika user yang diedit adalah user yang sedang login
      if (editingEmployee && result.data) {
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (currentUser.id === editingEmployee.id) {
          // Update localStorage dengan data terbaru
          const updatedUser = {
            ...currentUser,
            name: result.data.name,
            username: result.data.username,
            email: result.data.email,
            phone: result.data.phone,
            address: result.data.address,
            role: result.data.role,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }
      
      setShowEmployeeModal(false);
    } else {
      alert("Gagal menyimpan karyawan: " + result.error);
    }
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
              disabled={isProcessing || loading}
              className="bg-gradient-to-r from-[#5cb338] to-[#4d9a2e] text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all font-semibold flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 border-4 border-[#1a509a] border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-gray-500 font-medium">
                            Memuat karyawan...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : employees.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <FaUsers className="w-12 h-12 text-gray-400" />
                          <p className="text-gray-500 font-medium">
                            Belum ada karyawan
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    employees.map((employee, index) => (
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
                              disabled={isProcessing}
                              className="bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FaEdit className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(employee)}
                              disabled={isProcessing}
                              className="bg-gradient-to-r from-[#d84040] to-[#c23636] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FaTrash className="w-3 h-3" />
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
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
