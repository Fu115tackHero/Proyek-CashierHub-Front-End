import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { useEffect, useState, useCallback, useRef } from "react";
import { API_ENDPOINTS } from "../config/api";
import {
  FaChartLine,
  FaShoppingCart,
  FaBoxOpen,
  FaTrophy,
  FaCalendarDay,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [dashboardStats, setDashboardStats] = useState({
    todaySales: 0,
    todayTransactions: 0,
    topProducts: [],
    lowStockProducts: [],
    recentProducts: [],
    loading: true,
  });

  // Prevent multiple simultaneous API calls
  const isFetchingRef = useRef(false);

  useEffect(() => {
    // Get user role from localStorage
    const getUserRole = () => {
      try {
        const user = localStorage.getItem("user");
        if (user) {
          const userData = JSON.parse(user);
          setUserRole(userData.role || "Kasir");
        }
      } catch (error) {
        console.error("Error reading user role:", error);
        setUserRole("Kasir");
      }
    };
    getUserRole();
  }, []);

  const fetchDashboardStats = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;

    try {
      setDashboardStats((prev) => ({ ...prev, loading: true }));

      // Fetch transactions
      const transResponse = await fetch(API_ENDPOINTS.TRANSACTIONS);

      if (!transResponse.ok) {
        throw new Error(
          `Failed to fetch transactions: ${transResponse.status}`
        );
      }

      const transactions = await transResponse.json();

      // Check if response is error object
      if (transactions.error) {
        throw new Error(transactions.error);
      }

      if (!Array.isArray(transactions)) {
        throw new Error("Invalid transactions data format");
      }

      // Fetch products
      const productsResponse = await fetch(API_ENDPOINTS.PRODUCTS);

      if (!productsResponse.ok) {
        throw new Error(`Failed to fetch products: ${productsResponse.status}`);
      }

      const products = await productsResponse.json();

      // Check if response is error object
      if (products.error) {
        throw new Error(products.error);
      }

      if (!Array.isArray(products)) {
        throw new Error("Invalid products data format");
      }

      // Calculate today's sales
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayTransactions = transactions.filter((trans) => {
        const transDate = new Date(trans.transaction_date);
        transDate.setHours(0, 0, 0, 0);
        return transDate.getTime() === today.getTime();
      });

      const todaySales = todayTransactions.reduce(
        (sum, trans) => sum + parseFloat(trans.total_amount || 0),
        0
      );

      // Use all products directly (don't filter too strictly)
      const validProducts = Array.isArray(products) ? products : [];

      // ===== PRODUK TERLARIS (dari transaksi 1 minggu terakhir) =====
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      oneWeekAgo.setHours(0, 0, 0, 0);

      // Filter transaksi 1 minggu terakhir dan ambil detail items
      const recentTransactions = transactions.filter((trans) => {
        const transDate = new Date(trans.transaction_date);
        return transDate >= oneWeekAgo;
      });

      // Hitung total penjualan per produk dari transaction_items
      const productSalesMap = {};

      // Fetch all transaction details in parallel
      const detailPromises = recentTransactions.map(async (trans) => {
        try {
          const detailResponse = await fetch(
            `${API_ENDPOINTS.TRANSACTIONS}/${trans.id}`
          );
          if (detailResponse.ok) {
            const detail = await detailResponse.json();
            return detail;
          }
        } catch (error) {
          console.error(
            `Error fetching transaction detail ${trans.id}:`,
            error
          );
        }
        return null;
      });

      const transactionDetails = await Promise.all(detailPromises);

      // Process all items
      transactionDetails.forEach((detail) => {
        if (detail && detail.items && Array.isArray(detail.items)) {
          detail.items.forEach((item) => {
            // Try multiple possible field names for product_id
            const productId =
              item.product_id ||
              item.productId ||
              item.id_product ||
              item.product_code;
            const productName =
              item.product_name ||
              item.productName ||
              item.nama_product ||
              item.name ||
              "Unknown";
            const quantity =
              parseInt(item.quantity) ||
              parseInt(item.qty) ||
              parseInt(item.amount) ||
              0;

            if (productId) {
              if (productSalesMap[productId]) {
                productSalesMap[productId].totalSold += quantity;
              } else {
                productSalesMap[productId] = {
                  product_id: productId,
                  product_name: productName,
                  totalSold: quantity,
                };
              }
            }
          });
        }
      });

      // Sort by totalSold dan ambil top 5
      const topProducts = Object.values(productSalesMap)
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 5)
        .map((item) => {
          const product = validProducts.find((p) => p.id === item.product_id);
          return {
            id: item.product_id,
            nama: item.product_name,
            stok: product ? product.stok : 0,
            totalSold: item.totalSold,
          };
        });

      // ===== STOK MENIPIS (stok <= 20) =====
      const lowStockProducts = validProducts
        .filter((p) => {
          if (!p) return false;
          // Support both 'stock' and 'stok' field names
          const stock =
            p.stock !== undefined && p.stock !== null
              ? parseInt(p.stock)
              : p.stok !== undefined && p.stok !== null
              ? parseInt(p.stok)
              : 999;
          return stock <= 20 && stock >= 0;
        })
        .sort((a, b) => {
          const stockA =
            a.stock !== undefined
              ? parseInt(a.stock)
              : a.stok !== undefined
              ? parseInt(a.stok)
              : 999;
          const stockB =
            b.stock !== undefined
              ? parseInt(b.stock)
              : b.stok !== undefined
              ? parseInt(b.stok)
              : 999;
          return stockA - stockB;
        })
        .map((p) => ({
          id: p.id,
          nama: p.name || p.nama || "Unknown",
          stok:
            p.stock !== undefined
              ? parseInt(p.stock)
              : p.stok !== undefined
              ? parseInt(p.stok)
              : 0,
        }));

      // ===== PRODUK TERBARU (5 terakhir berdasarkan ID tertinggi) =====
      const recentProducts = [...validProducts]
        .filter((p) => {
          if (!p) return false;
          // Support both 'price' and 'harga' field names
          const price =
            p.price !== undefined && p.price !== null
              ? parseFloat(p.price)
              : p.harga !== undefined && p.harga !== null
              ? parseFloat(p.harga)
              : 0;
          return price > 0;
        })
        .sort((a, b) => (b.id || 0) - (a.id || 0))
        .slice(0, 5)
        .map((p) => ({
          id: p.id,
          nama: p.name || p.nama || "Unknown",
          harga:
            p.price !== undefined
              ? parseFloat(p.price)
              : p.harga !== undefined
              ? parseFloat(p.harga)
              : 0,
        }));

      setDashboardStats({
        todaySales,
        todayTransactions: todayTransactions.length,
        topProducts,
        lowStockProducts,
        recentProducts,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setDashboardStats((prev) => ({ ...prev, loading: false }));
    } finally {
      // Always reset fetching flag
      isFetchingRef.current = false;
    }
  }, []);

  // Fetch dashboard statistics for all users - only once on mount
  useEffect(() => {
    // Always fetch dashboard stats for all roles
    fetchDashboardStats();
  }, [fetchDashboardStats]); // Include fetchDashboardStats since it's a useCallback

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const isSuperAdmin = userRole === "Super Admin";
  const isAdmin = userRole === "Admin";
  const hasManagementAccess = isSuperAdmin || isAdmin;

  // Super Admin & Admin cards - all features
  const adminCards = [
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

  // Kasir cards - limited features
  const kasirCards = [
    {
      title: "Dashboard Kasir",
      description: "Kelola transaksi penjualan",
      color: "bg-[#4a77f4]",
      onClick: () => navigate("/pilih-barang"),
    },
    {
      title: "Laporan Penjualan",
      description: "Lihat riwayat transaksi",
      color: "bg-[#ece852]",
      onClick: () => navigate("/laporan"),
    },
    {
      title: "Profile",
      description: "Kelola informasi akun",
      color: "bg-[#9b59b6]",
      onClick: () => navigate("/profile"),
    },
  ];

  const cards = hasManagementAccess ? adminCards : kasirCards;

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 flex flex-col ml-56 overflow-hidden">
        <Header username="JoeMama" />
        <div className="bg-black h-[3px] w-full" />

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <h1 className="text-[32px] text-black mb-8">Dashboard</h1>

          {/* Welcome Message - Moved to top */}
          <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-[24px] text-black mb-4">
              Selamat Datang di CashierHub
            </h2>
            <p className="text-gray-600">
              Sistem manajemen kasir internal retail yang memudahkan Anda dalam
              mengelola transaksi penjualan, inventori barang, dan laporan
              keuangan.
            </p>
          </div>

          {/* Menu Cards */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Menu Akses Cepat
            </h2>
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
          </div>

          {/* Statistics Cards - For All Users */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Statistik & Laporan
            </h2>
            {dashboardStats.loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-10 h-10 border-4 border-[#1a509a] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {/* Sales Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-blue-100 text-sm">
                          Penjualan Hari Ini
                        </p>
                        <h3 className="text-3xl font-bold mt-1">
                          Rp {dashboardStats.todaySales.toLocaleString("id-ID")}
                        </h3>
                      </div>
                      <div className="bg-white/20 p-4 rounded-lg">
                        <FaChartLine className="w-8 h-8" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FaCalendarDay />
                      <span>
                        {new Date().toLocaleDateString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-green-100 text-sm">
                          Transaksi Hari Ini
                        </p>
                        <h3 className="text-3xl font-bold mt-1">
                          {dashboardStats.todayTransactions}
                        </h3>
                      </div>
                      <div className="bg-white/20 p-4 rounded-lg">
                        <FaShoppingCart className="w-8 h-8" />
                      </div>
                    </div>
                    <p className="text-green-100 text-sm">Transaksi tercatat</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-orange-100 text-sm">Stok Menipis</p>
                        <h3 className="text-3xl font-bold mt-1">
                          {dashboardStats.lowStockProducts.length}
                        </h3>
                      </div>
                      <div className="bg-white/20 p-4 rounded-lg">
                        <FaBoxOpen className="w-8 h-8" />
                      </div>
                    </div>
                    <p className="text-orange-100 text-sm">
                      Produk perlu restock
                    </p>
                  </div>
                </div>

                {/* Products Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Top Products */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-yellow-100 p-3 rounded-lg">
                        <FaTrophy className="w-6 h-6 text-yellow-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">
                        Produk Terlaris
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                      7 hari terakhir
                    </p>
                    <div className="space-y-3">
                      {dashboardStats.topProducts.length > 0 ? (
                        dashboardStats.topProducts.map((product, index) => (
                          <div
                            key={product.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="flex items-center justify-center w-6 h-6 bg-yellow-500 text-white text-xs font-bold rounded-full">
                                {index + 1}
                              </span>
                              <span className="font-medium text-gray-700 text-sm">
                                {product.nama || "Unknown"}
                              </span>
                            </div>
                            <span className="text-xs font-semibold text-yellow-600">
                              {product.totalSold || 0} terjual
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm text-center py-4">
                          Belum ada transaksi
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Low Stock Products */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-red-100 p-3 rounded-lg">
                        <FaArrowDown className="w-6 h-6 text-red-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">
                        Stok Menipis
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">Stok ≤ 20 unit</p>
                    <div className="space-y-3 max-h-[240px] overflow-y-auto pr-2">
                      {dashboardStats.lowStockProducts.length > 0 ? (
                        dashboardStats.lowStockProducts.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <span className="font-medium text-gray-700 text-sm">
                              {product.nama || "Unknown"}
                            </span>
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                              {product.stok || 0}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm text-center py-4">
                          Semua stok aman
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Recent Products */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <FaArrowUp className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">
                        Produk Terbaru
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                      7 hari terakhir
                    </p>
                    <div className="space-y-3">
                      {dashboardStats.recentProducts.length > 0 ? (
                        dashboardStats.recentProducts.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <span className="font-medium text-gray-700 text-sm">
                              {product.nama || "Unknown"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {product.harga
                                ? `Rp ${product.harga.toLocaleString("id-ID")}`
                                : "N/A"}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm text-center py-4">
                          Belum ada produk
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
