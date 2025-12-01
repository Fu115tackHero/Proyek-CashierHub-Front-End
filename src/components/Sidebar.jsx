import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import imgLogo from "figma:asset/91293b9b3a4aed9fdd1e62c0fc9c74efae4bcd9b.png";
import {
  FaTachometerAlt,
  FaBox,
  FaUsers,
  FaChartLine,
  FaSignOutAlt,
  FaExclamationTriangle,
  FaShoppingCart,
} from "react-icons/fa";

const MenuItem = ({ to, label, active, onClick, icon: Icon }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
        active
          ? "bg-white text-[#1a509a] shadow-md font-semibold"
          : "text-white hover:bg-white hover:bg-opacity-10 hover:translate-x-1"
      }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span className="text-sm">{label}</span>
    </Link>
  );
};

export const Sidebar = ({ onLogout }) => {
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Get user role from localStorage
  const getUserRole = () => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        return userData.role || "Kasir"; // Default to Kasir if no role
      }
    } catch (error) {
      console.error("Error reading user role:", error);
    }
    return "Kasir";
  };

  const userRole = getUserRole();
  const isAdmin = userRole === "Admin";
  const isSuperAdmin = userRole === "Super Admin";

  // Super Admin dan Admin punya akses menu manajemen
  const hasManagementAccess = isSuperAdmin || isAdmin;

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  return (
    <>
      <div className="bg-gradient-to-b from-[#1a509a] to-[#14407d] w-56 h-screen shadow-2xl flex flex-col fixed left-0 top-0 overflow-y-auto">
        <div className="p-4">
          <div className="bg-white rounded-xl p-3 mb-6 shadow-lg hover:shadow-xl transition-shadow">
            <img
              src={imgLogo}
              alt="CashierHub Logo"
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="mb-2">
              <p className="text-blue-200 text-xs font-semibold px-3 mb-2 uppercase tracking-wider">
                Menu Utama
              </p>
              <MenuItem
                to="/dashboard"
                label="Dashboard"
                icon={FaTachometerAlt}
                active={location.pathname === "/dashboard"}
              />
              <MenuItem
                to="/pilih-barang"
                label="Dashboard Kasir"
                icon={FaShoppingCart}
                active={location.pathname === "/pilih-barang"}
              />
            </div>

            {/* Menu Manajemen - For Admin and Super Admin */}
            {hasManagementAccess && (
              <div className="mb-2">
                <p className="text-blue-200 text-xs font-semibold px-3 mb-2 uppercase tracking-wider">
                  Manajemen
                </p>
                <div className="space-y-1">
                  <MenuItem
                    to="/kelola-barang"
                    label="Kelola Barang"
                    icon={FaBox}
                    active={location.pathname === "/kelola-barang"}
                  />
                  <MenuItem
                    to="/kelola-karyawan"
                    label="Kelola Karyawan"
                    icon={FaUsers}
                    active={location.pathname === "/kelola-karyawan"}
                  />
                </div>
              </div>
            )}

            {/* Menu Laporan - Available for both Admin and Kasir */}
            <div className="mb-2">
              <p className="text-blue-200 text-xs font-semibold px-3 mb-2 uppercase tracking-wider">
                Laporan
              </p>
              <MenuItem
                to="/laporan"
                label="Laporan Penjualan"
                icon={FaChartLine}
                active={location.pathname === "/laporan"}
              />
            </div>

            <div className="mt-auto pt-4 border-t border-blue-400 border-opacity-30">
              <MenuItem
                to="/"
                label="Keluar"
                icon={FaSignOutAlt}
                onClick={handleLogoutClick}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
            <div className="bg-gradient-to-r from-[#d84040] to-[#c23636] p-6 text-white">
              <div className="flex items-center gap-3">
                <FaExclamationTriangle className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Konfirmasi Keluar</h2>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-700 text-lg mb-6">
                Apakah Anda yakin ingin keluar dari aplikasi?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 bg-gradient-to-r from-[#d84040] to-[#c23636] text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  Ya, Keluar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
