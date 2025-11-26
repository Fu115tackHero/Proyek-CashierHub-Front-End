import { useState } from "react";
import { Modal } from "./Modal";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaIdCard,
  FaLock,
} from "react-icons/fa";

export const EmployeeModal = ({ onClose, onSave, employee = null }) => {
  // Initialize form data from employee prop
  const initialFormData = employee
    ? {
        nama: employee.nama || "",
        username: employee.username || "",
        email: employee.email || "",
        telepon: employee.telepon || "",
        alamat: employee.alamat || "",
        posisi: employee.posisi || "Kasir",
        password: "", // Don't pre-fill password for edit
      }
    : {
        nama: "",
        username: "",
        email: "",
        telepon: "",
        alamat: "",
        posisi: "Kasir",
        password: "",
      };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nama.trim()) newErrors.nama = "Nama harus diisi";
    if (!formData.username.trim()) {
      newErrors.username = "Username harus diisi";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username minimal 3 karakter";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email harus diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (!formData.telepon.trim()) newErrors.telepon = "Telepon harus diisi";
    if (!formData.alamat.trim()) newErrors.alamat = "Alamat harus diisi";
    if (!employee && !formData.password) {
      newErrors.password = "Password harus diisi untuk karyawan baru";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const employeeData = { ...formData };

      if (employee) {
        employeeData.id = employee.id;
        // Only include password if it was changed
        if (!employeeData.password) {
          delete employeeData.password;
        }
      }

      onSave(employeeData);
      handleClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleClose = () => {
    setFormData({
      nama: "",
      username: "",
      email: "",
      telepon: "",
      alamat: "",
      posisi: "Kasir",
      password: "",
    });
    setErrors({});
    onClose();
  };

  const modalTitle = employee ? "Edit Karyawan" : "Tambah Karyawan Baru";
  const submitButtonText = employee ? "Simpan Perubahan" : "Tambah Karyawan";

  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      title={modalTitle}
      size="md"
      footer={
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold"
          >
            Batal
          </button>
          <button
            type="submit"
            form="employee-form"
            className="px-5 py-2.5 bg-gradient-to-r from-[#5cb338] to-[#4d9a2e] text-white rounded-lg hover:shadow-lg transition-all font-semibold"
          >
            {submitButtonText}
          </button>
        </div>
      }
    >
      <form id="employee-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Nama */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <FaUser className="inline mr-2 text-[#1a509a]" />
            Nama Lengkap
          </label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a509a] transition-all ${
              errors.nama ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Masukkan nama lengkap"
          />
          {errors.nama && (
            <p className="text-red-500 text-sm mt-1">{errors.nama}</p>
          )}
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <FaIdCard className="inline mr-2 text-[#1a509a]" />
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a509a] transition-all ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Masukkan username (min 3 karakter)"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <FaEnvelope className="inline mr-2 text-[#1a509a]" />
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a509a] transition-all ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="email@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Telepon */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <FaPhone className="inline mr-2 text-[#1a509a]" />
            Telepon
          </label>
          <input
            type="tel"
            name="telepon"
            value={formData.telepon}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a509a] transition-all ${
              errors.telepon ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="08xxxxxxxxxx"
          />
          {errors.telepon && (
            <p className="text-red-500 text-sm mt-1">{errors.telepon}</p>
          )}
        </div>

        {/* Alamat */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <FaMapMarkerAlt className="inline mr-2 text-[#1a509a]" />
            Alamat
          </label>
          <textarea
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            rows="3"
            className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a509a] transition-all resize-none ${
              errors.alamat ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Masukkan alamat lengkap"
          />
          {errors.alamat && (
            <p className="text-red-500 text-sm mt-1">{errors.alamat}</p>
          )}
        </div>

        {/* Posisi */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <FaIdCard className="inline mr-2 text-[#1a509a]" />
            Posisi
          </label>
          <select
            name="posisi"
            value={formData.posisi}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a509a] transition-all"
          >
            <option value="Kasir">Kasir</option>
            <option value="Manager">Manager</option>
            <option value="Admin">Admin</option>
            <option value="Supervisor">Supervisor</option>
          </select>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <FaLock className="inline mr-2 text-[#1a509a]" />
            Password{" "}
            {employee && (
              <span className="text-gray-500 text-xs">
                (Kosongkan jika tidak ingin mengubah)
              </span>
            )}
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a509a] transition-all ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={
              employee ? "Kosongkan jika tidak diubah" : "Masukkan password"
            }
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>
      </form>
    </Modal>
  );
};
