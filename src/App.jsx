import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import PilihBarang from "./pages/PilihBarang";
import DataBarang from "./pages/DataBarang";
import RiwayatTransaksi from "./pages/RiwayatTransaksi";
import KelolaKaryawan from "./pages/KelolaKaryawan";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pilih-barang" element={<PilihBarang />} />
        <Route path="/kelola-barang" element={<DataBarang />} />
        <Route path="/laporan" element={<RiwayatTransaksi />} />
        <Route path="/kelola-karyawan" element={<KelolaKaryawan />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
