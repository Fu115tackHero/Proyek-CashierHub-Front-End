import React from "react";
import {
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaTrash,
  FaTimes,
  FaMoneyBillWave,
  FaBoxes,
  FaQrcode,
} from "react-icons/fa";

export const CartSidebar = ({
  cartItems,
  onRemoveFromCart,
  onIncrementQuantity,
  onDecrementQuantity,
  onUpdateQuantity,
  getTotalPrice,
  onCheckout,
  onCancel,
  onScanQR,
}) => {
  return (
    <div
      className="fixed right-0 top-0 bottom-0 w-80 bg-gradient-to-br from-[#1a509a] to-[#1e4a8a] flex flex-col shadow-2xl z-40"
      style={{ marginTop: "60px" }}
    >
      {/* Cart Header */}
      <div className="p-4 flex items-center gap-2 border-b border-white/10">
        <h2 className="text-lg font-bold text-white flex-1 flex items-center gap-2">
          <FaShoppingCart className="w-5 h-5" />
          Keranjang
        </h2>
        <button
          onClick={onScanQR}
          className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-white/30 transition-all flex items-center gap-1.5"
        >
          <FaQrcode className="w-3 h-3" />
          Scan QR
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-auto px-4 py-3">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-3">
              <FaShoppingCart className="w-8 h-8 text-white/50" />
            </div>
            <p className="text-white/70 font-medium text-sm">
              Keranjang kosong
            </p>
            <p className="text-white/50 text-xs mt-1">
              Tambahkan produk ke keranjang
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white/95 rounded-xl p-3 shadow-md"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-bold text-gray-800 text-xs flex-1 pr-2">
                    {item.nama}
                  </p>
                  <button
                    onClick={() => onRemoveFromCart(item.id)}
                    className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-all"
                  >
                    <FaTrash className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-xs">
                    @ Rp {item.harga.toLocaleString("id-ID")},00
                  </p>
                  <p className="text-[#1a509a] font-bold text-sm">
                    Rp {(item.harga * item.quantity).toLocaleString("id-ID")},00
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-lg">
                  <button
                    onClick={() => onDecrementQuantity(item.id)}
                    className="bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] text-white w-6 h-6 rounded-lg flex items-center justify-center hover:shadow-md transition-all"
                  >
                    <FaMinus className="w-2.5 h-2.5" />
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const newQty = parseInt(e.target.value) || 0;
                      if (newQty > 0) onUpdateQuantity(item.id, newQty);
                    }}
                    className="font-bold text-sm flex-1 text-center text-gray-800 bg-transparent outline-none w-12"
                    min="1"
                  />
                  <button
                    onClick={() => onIncrementQuantity(item.id)}
                    className="bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] text-white w-6 h-6 rounded-lg flex items-center justify-center hover:shadow-md transition-all"
                  >
                    <FaPlus className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Footer */}
      {cartItems.length > 0 && (
        <div className="p-4 bg-white/10 backdrop-blur-sm border-t border-white/20">
          <div className="bg-white rounded-xl p-3 mb-3 shadow-lg">
            <div className="flex justify-between mb-2 pb-2 border-b border-gray-200">
              <span className="font-semibold text-gray-700 flex items-center gap-1.5 text-xs">
                <FaBoxes className="w-3.5 h-3.5 text-[#1a509a]" />
                Jumlah Barang
              </span>
              <span className="font-bold text-gray-800 text-xs">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)} item
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-800 flex items-center gap-1.5 text-xs">
                <FaMoneyBillWave className="w-3.5 h-3.5 text-[#5cb338]" />
                Total
              </span>
              <span className="font-black text-lg text-[#1a509a]">
                Rp {getTotalPrice().toLocaleString("id-ID")},00
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="flex-1 bg-gradient-to-r from-[#d84040] to-[#c23636] text-white py-2.5 rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-1.5 text-sm"
            >
              <FaTimes className="w-3.5 h-3.5" />
              Batal
            </button>
            <button
              onClick={onCheckout}
              className="flex-1 bg-gradient-to-r from-[#5cb338] to-[#4d9a2e] text-white py-2.5 rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-1.5 text-sm"
            >
              <FaMoneyBillWave className="w-3.5 h-3.5" />
              Bayar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
