import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { Pagination } from "../components/Pagination";
import { EmployeeModal } from "../components/EmployeeModal";
import { useEmployees } from "../hooks/useEmployees";
import { useNotification } from "../hooks/useNotification";
import { API_ENDPOINTS } from "../config/api";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUsers,
  FaUserTie,
  FaUserShield,
  FaUser,
  FaTrophy,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

export default function KelolaKaryawan() {
  const navigate = useNavigate();
  const {
    showSuccess,
    showError,
    showWarning,
    showConfirmation,
    NotificationComponent,
  } = useNotification();
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
    refreshEmployees,
  } = useEmployees();

  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);
  const [stats, setStats] = useState({
    roleCounts: [],
    mostActive: [],
  });

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.USER_STATS);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, [employees]); // Refresh when employees change

  // Get current user untuk permission check
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isSuperAdmin = currentUser.role === "Super Admin";
  const isAdmin = currentUser.role === "Admin";

  // Auto-refresh data karyawan ketika halaman menjadi visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshEmployees();
      }
    };

    const handleFocus = () => {
      refreshEmployees();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [refreshEmployees]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleAddNew = () => {
    // Admin dan Super Admin bisa menambah karyawan
    // Admin hanya bisa menambah Kasir (dibatasi di EmployeeModal)
    setEditingEmployee(null);
    setShowEmployeeModal(true);
  };

  const handleEdit = (employee) => {
    // Admin tidak bisa edit Admin atau Super Admin (hanya bisa edit Kasir)
    if (
      isAdmin &&
      (employee.posisi === "Admin" || employee.posisi === "Super Admin")
    ) {
      showWarning(
        "Admin tidak memiliki izin untuk mengedit karyawan dengan role Admin atau Super Admin."
      );
      return;
    }

    setEditingEmployee(employee);
    setShowEmployeeModal(true);
  };

  const handleDelete = async (employee) => {
    // Admin tidak bisa hapus diri sendiri
    if (employee.id === currentUser.id) {
      showWarning("Anda tidak dapat menghapus akun Anda sendiri!");
      return;
    }

    // Admin tidak bisa hapus Admin atau Super Admin (hanya bisa hapus Kasir)
    if (
      isAdmin &&
      (employee.posisi === "Admin" || employee.posisi === "Super Admin")
    ) {
      showWarning(
        "Admin tidak memiliki izin untuk menghapus karyawan dengan role Admin atau Super Admin."
      );
      return;
    }

    // Super Admin tidak bisa hapus diri sendiri
    if (isSuperAdmin && employee.id === currentUser.id) {
      showWarning("Anda tidak dapat menghapus akun Anda sendiri!");
      return;
    }

    showConfirmation({
      title: "Konfirmasi Hapus",
      message: `Apakah Anda yakin ingin menghapus ${employee.nama}?`,
      onConfirm: async () => {
        setIsProcessing(true);
        const result = await deleteEmployee(employee.id);
        setIsProcessing(false);

        if (result.success) {
          showSuccess("Karyawan berhasil dihapus!");
        } else {
          showError("Gagal menghapus karyawan: " + result.error);
        }
      },
    });
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
      showSuccess(
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

          // Trigger custom event to update Header in real-time
          window.dispatchEvent(new Event("profileUpdated"));
        }
      }

      setShowEmployeeModal(false);
      setEditingEmployee(null);
    } else {
      showError(`Gagal: ${result.error || "Terjadi kesalahan"}`);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 flex flex-col ml-56 overflow-hidden">
        <Header username="JoeMama" />

        <div className="flex-1 p-4 flex flex-col overflow-hidden">
          {/* Page Title */}
          <div className="mb-4 flex items-center gap-2">
            <div className="bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] p-2 rounded-lg shadow-md">
              <FaUsers className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Kelola Karyawan
            </h1>
          </div>

          {/* Collapsible Info Dashboard */}
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300">
            {/* Header / Summary Bar (Always Visible) */}
            <div
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setIsStatsExpanded(!isStatsExpanded)}
            >
              <div className="flex flex-wrap items-center gap-4 md:gap-8">
                <h2 className="font-bold text-gray-700 text-sm mr-2">
                  Dashboard Ringkasan
                </h2>

                {/* Summary Item 1: Total Employees */}
                <div className="flex items-center gap-2 text-sm">
                  <div className="bg-blue-100 p-1 rounded-md">
                    <FaUsers className="text-blue-600 w-3 h-3" />
                  </div>
                  <span className="text-gray-600">
                    <span className="font-bold text-gray-800">
                      {stats.roleCounts.reduce(
                        (acc, curr) => acc + parseInt(curr.count),
                        0
                      )}
                    </span>{" "}
                    Total Karyawan
                  </span>
                </div>

                {/* Summary Item 2: Top Sales */}
                <div className="flex items-center gap-2 text-sm">
                  <div className="bg-yellow-100 p-1 rounded-md">
                    <FaTrophy className="text-yellow-600 w-3 h-3" />
                  </div>
                  <span className="text-gray-600">
                    Top Sales:{" "}
                    <span className="font-bold text-gray-800">
                      {stats.mostActive[0]?.name || "-"}
                    </span>
                  </span>
                </div>
              </div>

              <div className="text-gray-400">
                {isStatsExpanded ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>

            {/* Expanded Content */}
            {isStatsExpanded && (
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Role Counts */}
                  {["Super Admin", "Admin", "Kasir"].map((role) => {
                    const count =
                      stats.roleCounts.find((r) => r.role === role)?.count || 0;
                    let Icon = FaUser;
                    let color = "blue";
                    if (role === "Super Admin") {
                      Icon = FaUserShield;
                      color = "purple";
                    } else if (role === "Admin") {
                      Icon = FaUserTie;
                      color = "indigo";
                    } else {
                      Icon = FaUser;
                      color = "teal";
                    }

                    return (
                      <div
                        key={role}
                        className={`bg-white rounded-xl shadow-sm border border-${color}-100 p-4 flex items-center gap-4`}
                      >
                        <div className={`bg-${color}-100 p-3 rounded-full`}>
                          <Icon className={`text-${color}-600 w-6 h-6`} />
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                            {role}
                          </p>
                          <h3 className="text-2xl font-bold text-gray-800">
                            {count}
                          </h3>
                        </div>
                      </div>
                    );
                  })}

                  {/* Most Active */}
                  <div className="bg-white rounded-xl shadow-sm border border-yellow-100 p-4 md:col-span-1">
                    <div className="flex items-center gap-2 mb-3 border-b border-yellow-50 pb-2">
                      <div className="bg-yellow-100 p-1.5 rounded-lg">
                        <FaTrophy className="text-yellow-600 w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-gray-800 text-sm">
                        Top Sales
                      </h3>
                    </div>
                    <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar">
                      {stats.mostActive.length > 0 ? (
                        stats.mostActive.slice(0, 3).map((user, index) => (
                          <div
                            key={user.id}
                            className="flex items-center gap-3"
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                index === 0
                                  ? "bg-yellow-400"
                                  : index === 1
                                  ? "bg-gray-400"
                                  : "bg-orange-400"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {user.total_transactions} Transaksi
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-xs italic">
                          Belum ada data penjualan
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
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
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex-1 flex flex-col min-h-0">
            <div className="overflow-auto flex-1">
              <table className="w-full relative">
                <thead className="bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] sticky top-0 z-10">
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
                              employee.posisi === "Super Admin"
                                ? "bg-red-100 text-red-700"
                                : employee.posisi === "Admin" ||
                                  employee.posisi === "admin"
                                ? "bg-purple-100 text-purple-700"
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
                              disabled={
                                isProcessing ||
                                (isAdmin &&
                                  (employee.posisi === "Admin" ||
                                    employee.posisi === "Super Admin"))
                              }
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                isAdmin &&
                                (employee.posisi === "Admin" ||
                                  employee.posisi === "Super Admin")
                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  : "bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] text-white hover:shadow-md"
                              } disabled:opacity-50`}
                              title={
                                isAdmin &&
                                (employee.posisi === "Admin" ||
                                  employee.posisi === "Super Admin")
                                  ? "Admin tidak dapat edit karyawan Admin/Super Admin"
                                  : "Edit karyawan"
                              }
                            >
                              <FaEdit className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(employee)}
                              disabled={
                                isProcessing ||
                                employee.id === currentUser.id ||
                                (isAdmin &&
                                  (employee.posisi === "Admin" ||
                                    employee.posisi === "Super Admin"))
                              }
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                employee.id === currentUser.id ||
                                (isAdmin &&
                                  (employee.posisi === "Admin" ||
                                    employee.posisi === "Super Admin"))
                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  : "bg-gradient-to-r from-[#d84040] to-[#c23636] text-white hover:shadow-md"
                              } disabled:opacity-50`}
                              title={
                                employee.id === currentUser.id
                                  ? "Tidak dapat menghapus akun sendiri"
                                  : isAdmin &&
                                    (employee.posisi === "Admin" ||
                                      employee.posisi === "Super Admin")
                                  ? "Admin tidak dapat hapus karyawan Admin/Super Admin"
                                  : "Hapus karyawan"
                              }
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
            <div className="py-2 px-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-start">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
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

      <NotificationComponent />
    </div>
  );
}
