import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { Pagination } from "../components/Pagination";
import { TransactionDetailModal } from "../components/TransactionDetailModal";
import { FaChartBar, FaMoneyBillWave, FaEye } from "react-icons/fa";
import { API_ENDPOINTS } from "../config/api";

export default function RiwayatTransaksi() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("default");

  // Get current user info
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isSuperAdmin = currentUser.role === "Super Admin";
  const isAdmin = currentUser.role === "Admin";
  const hasFullAccess = isSuperAdmin || isAdmin; // Super Admin & Admin bisa lihat semua transaksi

  // Filter kasir states (only for Admin and Super Admin)
  const [cashiers, setCashiers] = useState([]);
  const [selectedCashier, setSelectedCashier] = useState("all");
  const [cashierSearchQuery, setCashierSearchQuery] = useState("");

  // 1. FIX: Inisialisasi tanggal menggunakan Waktu Lokal (bukan UTC)
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.TRANSACTIONS);
      if (!response.ok) {
        throw new Error("Gagal mengambil data transaksi");
      }
      const data = await response.json();

      // Transform data from backend to frontend format
      const transformedData = data.map((trans) => {
        const transDate = new Date(trans.transaction_date);
        return {
          id: trans.id,
          // Format string hanya untuk TAMPILAN di tabel
          tanggal: transDate.toLocaleDateString("id-ID"),
          // 2. FIX: Simpan object Date asli untuk Logic FILTERING
          originalDate: transDate,
          kasir: trans.kasir_name || "Unknown",
          kasir_id: trans.user_id, // Tambah user_id untuk filter
          total: parseFloat(trans.total_amount),
        };
      });

      setTransactions(transformedData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Auto-refresh ketika halaman menjadi visible/focused
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchTransactions();
      }
    };

    const handleFocus = () => {
      fetchTransactions();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    // Periodic refresh setiap 30 detik untuk memastikan data transaksi terbaru
    const intervalId = setInterval(() => {
      if (!document.hidden) {
        fetchTransactions();
      }
    }, 30000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      clearInterval(intervalId);
    };
  }, []);

  // Fetch list of cashiers (only for Admin and Super Admin)
  useEffect(() => {
    if (hasFullAccess) {
      const fetchCashiers = async () => {
        try {
          const response = await fetch(API_ENDPOINTS.USERS);
          if (response.ok) {
            const users = await response.json();
            // Filter hanya kasir dan admin
            const cashierList = users.filter(
              (u) => u.role === "Kasir" || u.role === "Admin"
            );
            setCashiers(cashierList);
          }
        } catch (error) {
          console.error("Error fetching cashiers:", error);
        }
      };
      fetchCashiers();
    }
  }, [hasFullAccess]);

  const handleViewDetail = async (transactionId) => {
    setLoadingDetail(true);
    try {
      const response = await fetch(
        `${API_ENDPOINTS.TRANSACTIONS}/${transactionId}`
      );
      if (!response.ok) {
        throw new Error("Gagal mengambil detail transaksi");
      }
      const data = await response.json();
      setSelectedTransaction(data);
      setShowDetailModal(true);
    } catch (error) {
      console.error("Error fetching transaction detail:", error);
      alert("Gagal memuat detail transaksi: " + error.message);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const getFilteredTransactions = () => {
    let filtered = transactions;

    // Filter berdasarkan role
    if (!hasFullAccess) {
      // Kasir hanya lihat transaksi mereka sendiri
      filtered = filtered.filter((trans) => trans.kasir_id === currentUser.id);
    } else if (selectedCashier !== "all") {
      // Admin/Super Admin filter berdasarkan kasir yang dipilih
      filtered = filtered.filter(
        (trans) => trans.kasir_id === parseInt(selectedCashier)
      );
    }

    if (hasFullAccess && cashierSearchQuery) {
      const query = cashierSearchQuery.toLowerCase();
      filtered = filtered.filter((trans) =>
        trans.kasir.toLowerCase().includes(query)
      );
    }

    // Filter berdasarkan periode waktu
    if (filterType === "default") {
      return filtered;
    }

    return filtered.filter((trans) => {
      // Gunakan originalDate agar akurat
      const transDate = trans.originalDate;

      if (filterType === "daily") {
        const filterDate = new Date(selectedDate);
        return (
          transDate.getDate() === filterDate.getDate() &&
          transDate.getMonth() === filterDate.getMonth() &&
          transDate.getFullYear() === filterDate.getFullYear()
        );
      } else if (filterType === "monthly") {
        return (
          transDate.getMonth() + 1 === selectedMonth &&
          transDate.getFullYear() === selectedYear
        );
      } else if (filterType === "yearly") {
        return transDate.getFullYear() === selectedYear;
      }

      return true;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  const totalPendapatan = filteredTransactions.reduce(
    (sum, t) => sum + t.total,
    0
  );

  const itemsPerPage = 7;
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 flex flex-col ml-56 overflow-hidden">
        <Header />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Laporan Penjualan
            </h1>
            <p className="text-gray-600">
              Pantau dan analisis performa penjualan Anda
            </p>
          </div>

          <div className="mb-6 flex gap-4 items-end">
            {/* Filter Kasir - Only for Admin and Super Admin */}
            {hasFullAccess && (
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filter Kasir
                </label>
                <select
                  value={selectedCashier}
                  onChange={(e) => {
                    setSelectedCashier(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                >
                  <option value="all">Semua Kasir</option>
                  {cashiers
                    .filter(
                      (cashier) =>
                        cashier.name
                          .toLowerCase()
                          .includes(cashierSearchQuery.toLowerCase()) ||
                        cashier.username
                          .toLowerCase()
                          .includes(cashierSearchQuery.toLowerCase())
                    )
                    .map((cashier) => (
                      <option key={cashier.id} value={cashier.id}>
                        {cashier.name} ({cashier.role})
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Searchbar Kasir - Only for Admin and Super Admin */}
            {hasFullAccess && (
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cari Kasir
                </label>
                <input
                  type="text"
                  placeholder="Cari nama atau username kasir..."
                  value={cashierSearchQuery}
                  onChange={(e) => setCashierSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                />
              </div>
            )}

            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter Berdasarkan
              </label>
              <select
                value={filterType}
                onChange={(e) => {
                  const newFilter = e.target.value;
                  setFilterType(newFilter);
                  setCurrentPage(1);

                  // 3. FIX: Reset ke tanggal HARI INI jika pindah ke "Harian"
                  if (newFilter === "daily") {
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = String(now.getMonth() + 1).padStart(2, "0");
                    const day = String(now.getDate()).padStart(2, "0");
                    setSelectedDate(`${year}-${month}-${day}`);
                  }
                }}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              >
                <option value="default">Semua Transaksi</option>
                <option value="daily">Harian</option>
                <option value="monthly">Bulanan</option>
                <option value="yearly">Tahunan</option>
              </select>
            </div>

            {filterType === "daily" && (
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pilih Tanggal
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                />
              </div>
            )}

            {filterType === "monthly" && (
              <>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pilih Bulan
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => {
                      setSelectedMonth(parseInt(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(
                      (month) => (
                        <option key={month} value={month}>
                          {new Date(0, month - 1).toLocaleString("id-ID", {
                            month: "long",
                          })}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pilih Tahun
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => {
                      setSelectedYear(parseInt(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  >
                    {Array.from(
                      { length: 10 },
                      (_, i) => new Date().getFullYear() - i
                    ).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {filterType === "yearly" && (
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pilih Tahun
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                >
                  {Array.from(
                    { length: 10 },
                    (_, i) => new Date().getFullYear() - i
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden flex flex-col">
            <div className="overflow-auto" style={{ minHeight: "400px" }}>
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-[#1a509a] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">
                      Memuat data transaksi...
                    </p>
                  </div>
                </div>
              ) : paginatedTransactions.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <FaChartBar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">
                      Belum ada transaksi
                    </p>
                  </div>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] sticky top-0">
                    <tr className="border-b border-blue-400">
                      <th className="text-left py-4 px-6 font-bold text-white uppercase tracking-wider text-sm">
                        No
                      </th>
                      <th className="text-left py-4 px-6 font-bold text-white uppercase tracking-wider text-sm">
                        Tanggal Transaksi
                      </th>
                      <th className="text-left py-4 px-6 font-bold text-white uppercase tracking-wider text-sm">
                        Nama Kasir
                      </th>
                      <th className="text-left py-4 px-6 font-bold text-white uppercase tracking-wider text-sm">
                        Total Pembayaran
                      </th>
                      <th className="text-center py-4 px-6 font-bold text-white uppercase tracking-wider text-sm">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTransactions.map((transaction, index) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                      >
                        <td className="py-4 px-6 font-medium text-gray-700">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="py-4 px-6 font-semibold text-gray-800">
                          {transaction.tanggal}
                        </td>
                        <td className="py-4 px-6 text-gray-700">
                          {transaction.kasir}
                        </td>
                        <td className="py-4 px-6 font-bold text-[#5cb338]">
                          Rp {transaction.total.toLocaleString("id-ID")},00
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleViewDetail(transaction.id)}
                            disabled={loadingDetail}
                            className="bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-md transition-all flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaEye className="w-4 h-4" />
                            {loadingDetail ? "Loading..." : "Detail"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="mr-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
                <div className="bg-gradient-to-r from-[#5cb338] to-[#4d9a2e] text-white rounded-xl px-6 py-3 shadow-lg inline-flex items-center gap-3">
                  <FaMoneyBillWave className="w-5 h-5" />
                  <span className="font-bold text-sm">Total Pendapatan:</span>
                  <span className="text-xl font-black">
                    Rp {totalPendapatan.toLocaleString("id-ID")},00
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {showDetailModal && selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedTransaction(null);
          }}
        />
      )}
    </div>
  );
}
