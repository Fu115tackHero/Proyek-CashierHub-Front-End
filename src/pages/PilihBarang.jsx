import { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { Pagination } from "../components/Pagination";
import { CartSidebar } from "../components/CartSidebar";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import { useNotification } from "../hooks/useNotification";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaQrcode, FaShoppingCart } from "react-icons/fa";
import { ScanQRModal } from "../components/ScanQRModal";
import { PaymentModal } from "../components/PaymentModal";
import { StrukPembayaran } from "../components/StrukPembayaran";

export default function PilihBarang() {
  const navigate = useNavigate();
  const { showWarning, showError, NotificationComponent } = useNotification();
  const {
    products,
    allProducts, // FIX: Ambil semua produk (tidak di-paginate) untuk scan
    loading,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    refreshProducts,
  } = useProducts({ hideOutOfStock: true }); // Hide out of stock products in cashier dashboard
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    getTotalPrice,
    getAvailableStock,
  } = useCart(showWarning);

  const [showScanModal, setShowScanModal] = useState(false);
  const [scanModalSource, setScanModalSource] = useState("search"); // 'search' or 'cart'
  const [isProcessingScan, setIsProcessingScan] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showStrukModal, setShowStrukModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cash: 0,
    change: 0,
    date: "",
  });

  // Auto-refresh data produk ketika halaman menjadi visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshProducts();
      }
    };

    const handleFocus = () => {
      refreshProducts();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [refreshProducts]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleCheckout = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (cashAmount, change) => {
    const cartSnapshot = [...cartItems];
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setPaymentData({
      cash: cashAmount,
      change: change,
      date: new Date().toLocaleString("id-ID"),
      items: cartSnapshot,
      total: getTotalPrice(),
      employeeName: user.name || "Kasir",
    });
    clearCart();
    setShowStrukModal(true);
  };

  const handleCancel = () => {
    clearCart();
  };

  const handleScanSuccess = (decodedText) => {
    // Cegah scan berulang terlalu cepat
    if (isProcessingScan) return { success: false, message: "Processing..." };

    console.log("Scanned:", decodedText);
    console.log("Searching in", allProducts.length, "products (not paginated)");

    // FIX: Cari produk dari SEMUA products (allProducts), bukan yang di-paginate
    // Convert kode to string first to handle numeric codes from fresh INSERT
    const foundProduct = allProducts.find(
      (p) => String(p.kode).toLowerCase() === String(decodedText).toLowerCase()
    );

    console.log("Found product:", foundProduct);

    if (foundProduct) {
      if (scanModalSource === "cart") {
        // Scan dari keranjang - tambah ke cart, modal TETAP BUKA
        if (foundProduct.stok > 0) {
          // Lock scan untuk mencegah double scan
          setIsProcessingScan(true);

          // Cek stok tersedia sebelum add
          const availableStock = getAvailableStock(
            foundProduct.id,
            foundProduct.stok
          );
          if (availableStock > 0) {
            // addToCart sudah handle increment otomatis jika item ada
            addToCart(foundProduct);
            
            // Unlock setelah 800ms
            setTimeout(() => {
              setIsProcessingScan(false);
            }, 800);

            return { success: true, message: foundProduct.nama };
          } else {
            showWarning(`Stok ${foundProduct.nama} tidak cukup!`);
            setIsProcessingScan(false);
            return { success: false, message: "Stok tidak cukup" };
          }
        } else {
          showWarning("Stok produk habis!");
          return { success: false, message: "Stok habis" };
        }
      } else {
        // Scan dari pencarian - close modal, tampilkan hasil
        setShowScanModal(false);
        setSearchQuery(decodedText);
        setCurrentPage(1);
        return { success: true, message: "Produk ditemukan" };
      }
    } else {
      showError("Produk tidak ditemukan!");
      return { success: false, message: "Produk tidak ditemukan" };
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 flex flex-col ml-56 overflow-hidden">
        <Header username="JoeMama" />

        <div className="flex-1 flex overflow-hidden relative">
          <div className="flex-1 flex flex-col p-4 pr-[340px] overflow-auto">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-800">
                Dashboard Kasir
              </h1>
              <p className="text-gray-600 text-sm">
                Pilih produk untuk ditambahkan ke keranjang
              </p>
            </div>

            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari produk berdasarkan nama, jenis, atau kode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl outline-none focus:border-[#1a509a] focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                />
              </div>
              <button
                onClick={() => {
                  setScanModalSource("search");
                  setShowScanModal(true);
                }}
                className="bg-gradient-to-r from-[#5cb338] to-[#4d9a2e] text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all font-semibold flex items-center gap-2 text-sm"
              >
                <FaQrcode className="w-4 h-4" />
                Scan QR
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 flex-1 flex flex-col overflow-hidden min-h-0">
              <div
                className="overflow-auto flex-1"
                style={{ minHeight: "400px" }}
              >
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] sticky top-0 z-10">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-bold text-white uppercase">
                        No
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-white uppercase">
                        Nama Barang
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-white uppercase">
                        jenis
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-white uppercase">
                        Kode
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-white uppercase">
                        Stok
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-white uppercase">
                        Harga
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
                              Memuat produk...
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-12">
                          <p className="text-gray-500 font-medium">
                            Tidak ada produk
                          </p>
                        </td>
                      </tr>
                    ) : (
                      products.map((product, index) => {
                        const availableStock = getAvailableStock(
                          product.id,
                          product.stok
                        );
                        const isOutOfStock = availableStock <= 0;

                        return (
                          <tr
                            key={product.id}
                            className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                          >
                            <td className="py-3 px-4 text-sm text-gray-700">
                              {(currentPage - 1) * 7 + index + 1}
                            </td>
                            <td className="py-3 px-4 text-sm font-semibold text-gray-800">
                              {product.nama}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {product.jenis}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600 font-mono">
                              {product.kode}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              <span
                                className={`px-2 py-1 rounded-full font-semibold text-xs ${
                                  availableStock > 50
                                    ? "bg-green-100 text-green-700"
                                    : availableStock > 20
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {availableStock}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm font-bold text-[#1a509a]">
                              Rp {product.harga.toLocaleString("id-ID")}
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => addToCart(product)}
                                disabled={isOutOfStock}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                  isOutOfStock
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-[#5cb338] to-[#4d9a2e] text-white hover:shadow-md"
                                }`}
                              >
                                <FaShoppingCart className="w-3 h-3" />
                                {isOutOfStock ? "Habis" : "Tambah"}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

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

          {/* Cart Sidebar - Now Independent Component */}
          <CartSidebar
            cartItems={cartItems}
            onRemoveFromCart={removeFromCart}
            onIncrementQuantity={incrementQuantity}
            onDecrementQuantity={decrementQuantity}
            onUpdateQuantity={updateQuantity}
            getTotalPrice={getTotalPrice}
            onCheckout={handleCheckout}
            onCancel={handleCancel}
            onScanQR={() => {
              setScanModalSource("cart");
              setShowScanModal(true);
            }}
            getAvailableStock={getAvailableStock}
            isScanModalOpen={showScanModal}
          />
        </div>
      </div>

      {showScanModal && (
        <ScanQRModal
          onClose={() => setShowScanModal(false)}
          onScanSuccess={handleScanSuccess}
          fromCart={scanModalSource === "cart"}
          isProcessing={isProcessingScan}
        />
      )}

      {showPaymentModal && (
        <PaymentModal
          total={getTotalPrice()}
          cartItems={cartItems}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          onTransactionComplete={refreshProducts}
        />
      )}

      {showStrukModal && (
        <StrukPembayaran
          items={paymentData.items}
          total={paymentData.total}
          cash={paymentData.cash}
          change={paymentData.change}
          date={paymentData.date}
          employeeName={paymentData.employeeName}
          onClose={() => setShowStrukModal(false)}
        />
      )}

      <NotificationComponent />
    </div>
  );
}
