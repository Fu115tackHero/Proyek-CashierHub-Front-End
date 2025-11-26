import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { Pagination } from "../components/Pagination";
import { CartSidebar } from "../components/CartSidebar";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaQrcode, FaShoppingCart } from "react-icons/fa";
import { ScanQRModal } from "../components/ScanQRModal";
import { PaymentModal } from "../components/PaymentModal";
import { StrukPembayaran } from "../components/StrukPembayaran";

export default function PilihBarang() {
  const navigate = useNavigate();
  const {
    products,
    loading,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useProducts();
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    getTotalPrice,
  } = useCart();

  const [showScanModal, setShowScanModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showStrukModal, setShowStrukModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cash: 0,
    change: 0,
    date: "",
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleCheckout = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (cashAmount, change) => {
    const cartSnapshot = [...cartItems];
    setPaymentData({
      cash: cashAmount,
      change: change,
      date: new Date().toLocaleString("id-ID"),
      items: cartSnapshot,
      total: getTotalPrice(),
    });
    clearCart();
    setShowStrukModal(true);
  };

  const handleCancel = () => {
    clearCart();
  };

  const handleScanSuccess = (decodedText) => {
    console.log("Scanned:", decodedText);
    setSearchQuery(decodedText);
    setShowScanModal(false);
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
                  placeholder="Cari produk berdasarkan nama, merek, atau kode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl outline-none focus:border-[#1a509a] focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                />
              </div>
              <button
                onClick={() => setShowScanModal(true)}
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
                        Merek
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
                      products.map((product, index) => (
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
                            {product.merek}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600 font-mono">
                            {product.kode}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full font-semibold text-xs ${
                                product.stok > 50
                                  ? "bg-green-100 text-green-700"
                                  : product.stok > 20
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {product.stok}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm font-bold text-[#1a509a]">
                            Rp {product.harga.toLocaleString("id-ID")}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => addToCart(product)}
                              className="bg-gradient-to-r from-[#5cb338] to-[#4d9a2e] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:shadow-md transition-all flex items-center gap-1.5"
                            >
                              <FaShoppingCart className="w-3 h-3" />
                              Tambah
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
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
            onScanQR={() => setShowScanModal(true)}
          />
        </div>
      </div>

      {showScanModal && (
        <ScanQRModal
          onClose={() => setShowScanModal(false)}
          onScanSuccess={handleScanSuccess}
        />
      )}

      {showPaymentModal && (
        <PaymentModal
          total={getTotalPrice()}
          cartItems={cartItems}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {showStrukModal && (
        <StrukPembayaran
          items={paymentData.items}
          total={paymentData.total}
          cash={paymentData.cash}
          change={paymentData.change}
          date={paymentData.date}
          onClose={() => setShowStrukModal(false)}
        />
      )}
    </div>
  );
}
