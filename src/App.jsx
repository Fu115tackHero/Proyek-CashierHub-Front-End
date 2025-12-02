import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import PilihBarang from "./pages/PilihBarang";
import DataBarang from "./pages/DataBarang";
import RiwayatTransaksi from "./pages/RiwayatTransaksi";
import KelolaKaryawan from "./pages/KelolaKaryawan";
import ProfilePage from "./pages/ProfilePage";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pilih-barang"
          element={
            <ProtectedRoute>
              <PilihBarang />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kelola-barang"
          element={
            <AdminRoute>
              <DataBarang />
            </AdminRoute>
          }
        />
        <Route
          path="/laporan"
          element={
            <ProtectedRoute>
              <RiwayatTransaksi />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kelola-karyawan"
          element={
            <AdminRoute>
              <KelolaKaryawan />
            </AdminRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
