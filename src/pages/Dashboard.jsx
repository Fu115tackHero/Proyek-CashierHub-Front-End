import React from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const cards = [
    {
      title: "Dashboard Kasir",
      description: "Kelola transaksi penjualan",
      color: "bg-[#4a77f4]",
      onClick: () => navigate("/pilih-barang"),
    },
    {
      title: "Kelola Barang",
      description: "Manajemen data produk",
      color: "bg-[#5cb338]",
      onClick: () => navigate("/kelola-barang"),
    },
    {
      title: "Laporan Penjualan",
      description: "Lihat riwayat transaksi",
      color: "bg-[#ece852]",
      onClick: () => navigate("/laporan"),
    },
    {
      title: "Kelola Karyawan",
      description: "Manajemen data karyawan",
      color: "bg-[#ff6b6b]",
      onClick: () => navigate("/kelola-karyawan"),
    },
    {
      title: "Profile",
      description: "Kelola informasi akun",
      color: "bg-[#9b59b6]",
      onClick: () => navigate("/profile"),
    },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 flex flex-col ml-56 overflow-hidden">
        <Header username="JoeMama" />
        <div className="bg-black h-[3px] w-full" />

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <h1 className="text-[32px] text-black mb-8">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <div
                key={index}
                onClick={card.onClick}
                className={`${card.color} rounded-lg p-6 cursor-pointer hover:opacity-90 transition-opacity shadow-lg`}
              >
                <h2 className="text-[24px] text-white mb-2">{card.title}</h2>
                <p className="text-white">{card.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-[24px] text-black mb-4">
              Selamat Datang di CashierHub
            </h2>
            <p className="text-gray-600">
              Sistem manajemen kasir internal retail yang memudahkan Anda dalam
              mengelola transaksi penjualan, inventori barang, dan laporan
              keuangan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
