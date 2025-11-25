import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { dashboardSvgPaths, karyawanSvgPaths } from "../assets/svg-paths";
import imgLogo from "figma:asset/91293b9b3a4aed9fdd1e62c0fc9c74efae4bcd9b.png";

const HomeIcon = () => (
  <svg className="w-[30px] h-[30px]" fill="none" viewBox="0 0 30 30">
    <path d={dashboardSvgPaths.p9aa6b00} fill="white" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-[30px] h-[30px]" fill="none" viewBox="0 0 30 30">
    <path
      clipRule="evenodd"
      d={karyawanSvgPaths.p15156f00}
      fill="white"
      fillRule="evenodd"
    />
    <path
      clipRule="evenodd"
      d={karyawanSvgPaths.p1c3b5300}
      fill="white"
      fillRule="evenodd"
    />
  </svg>
);

const BoxIcon = () => (
  <svg className="w-[30px] h-[30px]" fill="none" viewBox="0 0 30 30">
    <path
      d={dashboardSvgPaths.p2fd3f0e0}
      stroke="white"
      strokeLinecap="round"
      strokeWidth="1.5"
    />
  </svg>
);

const ReportIcon = () => (
  <svg className="w-[30px] h-[30px]" fill="none" viewBox="0 0 30 30">
    <path d={dashboardSvgPaths.p35e380} fill="white" />
    <path d={dashboardSvgPaths.p1b2e7280} fill="white" />
  </svg>
);

const ReportOutlineIcon = () => (
  <svg className="w-[30px] h-[30px]" fill="none" viewBox="0 0 30 30">
    <path
      d={karyawanSvgPaths.p220a4500}
      stroke="white"
      strokeLinejoin="round"
      strokeWidth="1.875"
    />
  </svg>
);

const TicketIcon = () => (
  <svg className="w-[30px] h-[30px]" fill="none" viewBox="0 0 30 30">
    <path d={karyawanSvgPaths.pebac980} fill="white" />
  </svg>
);

const ManagerSidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#1a509a] w-[306px] h-screen shadow-[5px_0px_12.2px_0px_rgba(0,0,0,0.25)] flex flex-col px-6 py-16">
      {/* Logo */}
      <div className="mb-8">
        <img
          src={imgLogo}
          alt="CashierHub Logo"
          className="w-full h-[65px] object-contain"
        />
        <div className="h-[2px] bg-white mt-8" />
      </div>

      {/* Menu Items */}
      <div className="flex flex-col gap-8">
        {/* Dashboard */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-5 px-4 py-3 rounded-[20px] text-white hover:bg-[#2d6bc4] transition-colors"
          >
            <HomeIcon />
            <span className="text-[20px]">Dashboard</span>
          </button>
          <div className="h-[2px] bg-white" />
        </div>

        {/* Karyawan */}
        <div className="flex flex-col gap-2">
          <p className="text-white text-[20px] px-4">Karyawan</p>
          <button
            onClick={() => navigate("/tambah-karyawan")}
            className="flex items-center gap-5 px-4 py-3 rounded-[20px] bg-[#4a77f4] text-white"
          >
            <UsersIcon />
            <span className="text-[20px]">Kelola Karyawan</span>
          </button>
          <div className="h-[2px] bg-white" />
        </div>

        {/* Barang */}
        <div className="flex flex-col gap-2">
          <p className="text-white text-[20px] px-4">Barang</p>
          <button
            onClick={() => navigate("/kelola-barang")}
            className="flex items-center gap-5 px-4 py-3 rounded-[20px] text-white hover:bg-[#2d6bc4] transition-colors"
          >
            <BoxIcon />
            <span className="text-[20px]">Kelola Barang</span>
          </button>
          <button className="flex items-center gap-5 px-4 py-3 rounded-[20px] text-white hover:bg-[#2d6bc4] transition-colors">
            <TicketIcon />
            <span className="text-[20px]">Kelola Tiket</span>
          </button>
          <div className="h-[2px] bg-white" />
        </div>

        {/* Laporan */}
        <div className="flex flex-col gap-2">
          <p className="text-white text-[20px] px-4">Laporan</p>
          <button
            onClick={() => navigate("/laporan")}
            className="flex items-center gap-5 px-4 py-3 rounded-[20px] text-white hover:bg-[#2d6bc4] transition-colors"
          >
            <ReportIcon />
            <span className="text-[20px]">Laporan Harian</span>
          </button>
          <button className="flex items-center gap-5 px-4 py-3 rounded-[20px] text-white hover:bg-[#2d6bc4] transition-colors">
            <ReportOutlineIcon />
            <span className="text-[20px]">Laporan Bulanan</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function TambahKaryawan() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    namaKasir: "",
    username: "",
    email: "",
    nomorTelepon: "",
    alamat: "",
    password: "",
    konfirmasiPassword: "",
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (formData.password !== formData.konfirmasiPassword) {
      alert("Password dan konfirmasi password tidak cocok!");
      return;
    }

    if (
      !formData.namaKasir ||
      !formData.username ||
      !formData.email ||
      !formData.password
    ) {
      alert("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    alert("Karyawan berhasil ditambahkan!");
    console.log("Data karyawan:", formData);
    // Reset form
    setFormData({
      namaKasir: "",
      username: "",
      email: "",
      nomorTelepon: "",
      alamat: "",
      password: "",
      konfirmasiPassword: "",
    });
  };

  return (
    <div className="flex bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <ManagerSidebar onLogout={handleLogout} />

      <div className="flex-1">
        <Header />
        <div className="bg-black h-[3px] w-full" />

        <div className="px-8 py-6">
          <h1 className="text-[24px] text-black mb-6">Tambah Karyawan</h1>

          <div className="bg-white rounded-[10px] shadow-[0px_3px_8.2px_5px_rgba(0,0,0,0.25)] p-8">
            <div className="flex flex-col gap-6 max-w-[1092px]">
              {/* Nama Kasir */}
              <div>
                <p className="text-[18px] mb-4">Nama Kasir</p>
                <input
                  type="text"
                  value={formData.namaKasir}
                  onChange={(e) => handleChange("namaKasir", e.target.value)}
                  className="w-full h-[50px] rounded-[50px] border border-black px-6 text-[16px]"
                  placeholder="Masukkan nama kasir"
                />
              </div>

              {/* Username */}
              <div>
                <p className="text-[18px] mb-4">Username</p>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  className="w-full h-[50px] rounded-[50px] border border-black px-6 text-[16px]"
                  placeholder="Masukkan username"
                />
              </div>

              {/* Email */}
              <div>
                <p className="text-[18px] mb-4">Email</p>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full h-[50px] rounded-[50px] border border-black px-6 text-[16px]"
                  placeholder="Masukkan email"
                />
              </div>

              {/* Nomor Telepon */}
              <div>
                <p className="text-[18px] mb-4">Nomor Telepon</p>
                <input
                  type="tel"
                  value={formData.nomorTelepon}
                  onChange={(e) => handleChange("nomorTelepon", e.target.value)}
                  className="w-full h-[50px] rounded-[50px] border border-black px-6 text-[16px]"
                  placeholder="Masukkan nomor telepon"
                />
              </div>

              {/* Alamat */}
              <div>
                <p className="text-[18px] mb-4">Alamat</p>
                <input
                  type="text"
                  value={formData.alamat}
                  onChange={(e) => handleChange("alamat", e.target.value)}
                  className="w-full h-[50px] rounded-[50px] border border-black px-6 text-[16px]"
                  placeholder="Masukkan alamat"
                />
              </div>

              {/* Password Fields */}
              <div className="flex gap-14">
                <div className="flex-1">
                  <p className="text-[18px] mb-4">Password</p>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className="w-full h-[50px] rounded-[50px] border border-black px-6 text-[16px]"
                    placeholder="Masukkan password"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-[18px] mb-4">Konfirmasi Password</p>
                  <input
                    type="password"
                    value={formData.konfirmasiPassword}
                    onChange={(e) =>
                      handleChange("konfirmasiPassword", e.target.value)
                    }
                    className="w-full h-[50px] rounded-[50px] border border-black px-6 text-[16px]"
                    placeholder="Konfirmasi password"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-4">
                <button
                  onClick={handleSubmit}
                  className="bg-[#4a77f4] text-white px-12 py-2 rounded-[7px] hover:bg-[#3d66d4] transition-colors"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
