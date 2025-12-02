import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { Pagination } from "../components/Pagination";
import { TransactionDetailModal } from "../components/TransactionDetailModal";
import { useNotification } from "../hooks/useNotification";
import {
  FaChartBar,
  FaMoneyBillWave,
  FaEye,
  FaFileDownload,
  FaFileCsv,
} from "react-icons/fa";
import { API_ENDPOINTS } from "../config/api";

export default function RiwayatTransaksi() {
  const navigate = useNavigate();
  const { showError, showWarning, NotificationComponent } = useNotification();
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
  const [selectedWeekStart, setSelectedWeekStart] = useState(() => {
    // Get Monday of current week
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    const year = monday.getFullYear();
    const month = String(monday.getMonth() + 1).padStart(2, "0");
    const date = String(monday.getDate()).padStart(2, "0");
    return `${year}-${month}-${date}`;
  });
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

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
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
      showError("Gagal memuat detail transaksi: " + error.message);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Export functions
  const getExportFileName = () => {
    let fileName = "Laporan_Penjualan";

    // Add role info
    if (!hasFullAccess) {
      fileName += `_${currentUser.name.replace(/\s+/g, "_")}`;
    } else if (selectedCashier !== "all") {
      const cashier = cashiers.find((c) => c.id === parseInt(selectedCashier));
      if (cashier) {
        fileName += `_${cashier.name.replace(/\s+/g, "_")}`;
      }
    } else {
      fileName += "_Semua_Kasir";
    }

    // Add period info
    if (filterType === "daily") {
      const date = new Date(selectedDate);
      fileName += `_${date.getDate()}-${
        date.getMonth() + 1
      }-${date.getFullYear()}`;
    } else if (filterType === "weekly") {
      const startDate = new Date(selectedWeekStart);
      fileName += `_Minggu_${startDate.getDate()}-${
        startDate.getMonth() + 1
      }-${startDate.getFullYear()}`;
    } else if (filterType === "monthly") {
      const monthName = new Date(0, selectedMonth - 1).toLocaleString("id-ID", {
        month: "long",
      });
      fileName += `_${monthName}_${selectedYear}`;
    } else if (filterType === "yearly") {
      fileName += `_${selectedYear}`;
    } else {
      fileName += "_Semua_Periode";
    }

    return fileName;
  };

  const exportToCSV = async () => {
    if (filteredTransactions.length === 0) {
      showWarning("Tidak ada data untuk diekspor");
      return;
    }

    try {
      setLoadingDetail(true);

      // Fetch all transaction details
      const detailPromises = filteredTransactions.map(async (trans) => {
        try {
          const response = await fetch(
            `${API_ENDPOINTS.TRANSACTIONS}/${trans.id}`
          );
          if (response.ok) {
            return await response.json();
          }
        } catch (error) {
          console.error(`Error fetching transaction ${trans.id}:`, error);
        }
        return null;
      });

      const transactionDetails = await Promise.all(detailPromises);
      const validDetails = transactionDetails.filter((d) => d !== null);

      // CSV Headers
      const headers = [
        "No",
        "Tanggal",
        "Kasir",
        "Nama Barang",
        "Jumlah",
        "Harga (Rp)",
        "Subtotal (Rp)",
        "Total Transaksi (Rp)",
        "Uang Dibayar (Rp)",
        "Kembalian (Rp)",
      ];

      // CSV Rows - detailed items
      const rows = [];
      validDetails.forEach((detail, index) => {
        detail.items.forEach((item, itemIndex) => {
          // Parse price safely, fallback to 0 if null/undefined
          const price =
            item.price_at_transaction !== null &&
            item.price_at_transaction !== undefined
              ? parseFloat(item.price_at_transaction)
              : 0;
          const subtotal =
            item.subtotal !== null && item.subtotal !== undefined
              ? parseFloat(item.subtotal)
              : 0;
          const totalAmount =
            detail.total_amount !== null && detail.total_amount !== undefined
              ? parseFloat(detail.total_amount)
              : 0;
          const cashAmount =
            detail.cash_amount !== null && detail.cash_amount !== undefined
              ? parseFloat(detail.cash_amount)
              : 0;
          const changeAmount =
            detail.change_amount !== null && detail.change_amount !== undefined
              ? parseFloat(detail.change_amount)
              : 0;

          rows.push([
            itemIndex === 0 ? index + 1 : "",
            itemIndex === 0 ? detail.transaction_date : "",
            itemIndex === 0 ? detail.kasir_name : "",
            item.product_name || "",
            item.quantity || 0,
            price, // Raw number, no formatting
            subtotal, // Raw number, no formatting
            itemIndex === 0 ? totalAmount : "", // Raw number, no formatting
            itemIndex === 0 ? cashAmount : "", // Raw number, no formatting
            itemIndex === 0 ? changeAmount : "", // Raw number, no formatting
          ]);
        });
      });

      // Add summary row
      rows.push([]);
      rows.push(["", "", "", "", "", "", "TOTAL PENDAPATAN:", totalPendapatan]);

      // Convert to CSV string
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      // Create and download file
      const blob = new Blob(["\ufeff" + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute("download", `${getExportFileName()}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      showError("Gagal mengekspor data: " + error.message);
    } finally {
      setLoadingDetail(false);
    }
  };

  const exportToJSON = async () => {
    if (filteredTransactions.length === 0) {
      showWarning("Tidak ada data untuk diekspor");
      return;
    }

    try {
      setLoadingDetail(true);

      // Fetch all transaction details
      const detailPromises = filteredTransactions.map(async (trans) => {
        try {
          const response = await fetch(
            `${API_ENDPOINTS.TRANSACTIONS}/${trans.id}`
          );
          if (response.ok) {
            return await response.json();
          }
        } catch (error) {
          console.error(`Error fetching transaction ${trans.id}:`, error);
        }
        return null;
      });

      const transactionDetails = await Promise.all(detailPromises);
      const validDetails = transactionDetails.filter((d) => d !== null);

      // Prepare export data with full details
      const exportData = {
        metadata: {
          exported_at: new Date().toISOString(),
          exported_by: currentUser.name,
          role: currentUser.role,
          filter: {
            type: filterType,
            period:
              filterType === "daily"
                ? selectedDate
                : filterType === "weekly"
                ? `Minggu ${selectedWeekStart}`
                : filterType === "monthly"
                ? `${selectedMonth}/${selectedYear}`
                : filterType === "yearly"
                ? selectedYear.toString()
                : "all",
            cashier: !hasFullAccess
              ? currentUser.name
              : selectedCashier !== "all"
              ? cashiers.find((c) => c.id === parseInt(selectedCashier))?.name
              : "all",
          },
          total_transactions: validDetails.length,
          total_revenue: totalPendapatan,
        },
        transactions: validDetails.map((detail, index) => ({
          no: index + 1,
          id: detail.id,
          transaction_date: detail.transaction_date,
          kasir_name: detail.kasir_name,
          kasir_username: detail.kasir_username,
          total_amount: parseFloat(detail.total_amount),
          cash_amount: parseFloat(detail.cash_amount),
          change_amount: parseFloat(detail.change_amount),
          items: detail.items.map((item) => ({
            product_name: item.product_name,
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price_at_transaction),
            subtotal: parseFloat(item.subtotal),
          })),
        })),
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute("download", `${getExportFileName()}.json`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting to JSON:", error);
      showError("Gagal mengekspor data: " + error.message);
    } finally {
      setLoadingDetail(false);
    }
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
      } else if (filterType === "weekly") {
        const weekStart = new Date(selectedWeekStart);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6); // Sunday
        weekEnd.setHours(23, 59, 59, 999);
        return transDate >= weekStart && transDate <= weekEnd;
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

        <div className="flex-1 flex flex-col overflow-hidden p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Laporan Penjualan
              </h1>
              <p className="text-gray-600 text-sm">
                Pantau dan analisis performa penjualan Anda
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportToCSV}
                disabled={
                  loading || loadingDetail || filteredTransactions.length === 0
                }
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaFileCsv className="w-4 h-4" />
                {loadingDetail ? "Loading..." : "Export CSV"}
              </button>
              <button
                onClick={exportToJSON}
                disabled={
                  loading || loadingDetail || filteredTransactions.length === 0
                }
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaFileDownload className="w-4 h-4" />
                {loadingDetail ? "Loading..." : "Export JSON"}
              </button>
            </div>
          </div>

          <div className="mb-4 flex gap-4 items-end">
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
                <option value="weekly">Mingguan</option>
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

            {filterType === "weekly" && (
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pilih Minggu
                </label>
                <input
                  type="date"
                  value={selectedWeekStart}
                  onChange={(e) => {
                    setSelectedWeekStart(e.target.value);
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

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden flex-1 flex flex-col min-h-0">
            <div className="overflow-auto flex-1">
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
                <table className="w-full relative">
                  <thead className="bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] sticky top-0 z-10">
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

      <NotificationComponent />
    </div>
  );
}
