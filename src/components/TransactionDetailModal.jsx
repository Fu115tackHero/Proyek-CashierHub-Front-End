import { FaTimes, FaReceipt, FaUser, FaCalendarAlt } from "react-icons/fa";

export const TransactionDetailModal = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return `Rp ${parseFloat(amount).toLocaleString("id-ID")},00`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* UBAH: max-w-3xl jadi max-w-2xl agar lebih kecil, tambah max-h-[90vh] agar tidak bablas ke bawah */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] animate-fadeIn">
        {/* Header - Fixed */}
        <div className="bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] p-5 text-white flex items-center justify-between flex-shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <FaReceipt className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Detail Transaksi</h2>
              <p className="text-xs opacity-90">ID: #{transaction.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable Body */}
        <div className="p-5 overflow-y-auto custom-scrollbar">
          {/* Transaction Info */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-blue-50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <FaUser className="text-[#1a509a] text-sm" />
                <p className="text-xs text-gray-600 font-semibold">Kasir</p>
              </div>
              <p className="text-sm font-bold text-gray-800">
                {transaction.kasir_name}
              </p>
              <p className="text-[10px] text-gray-500">
                @{transaction.kasir_username}
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <FaCalendarAlt className="text-[#5cb338] text-sm" />
                <p className="text-xs text-gray-600 font-semibold">Waktu</p>
              </div>
              <p className="text-sm font-bold text-gray-800">
                {formatDate(transaction.transaction_date)}
              </p>
            </div>
          </div>

          {/* Items Table Section */}
          <div className="mb-5">
            <h3 className="text-sm font-bold text-gray-800 mb-2">
              Daftar Produk
            </h3>

            {/* UBAH: Container tabel diberi batas tinggi dan overflow-auto */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="overflow-y-auto max-h-[250px] custom-scrollbar">
                <table className="w-full relative">
                  <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="text-left py-2 px-4 text-[10px] font-bold text-gray-700 uppercase">
                        No
                      </th>
                      <th className="text-left py-2 px-4 text-[10px] font-bold text-gray-700 uppercase">
                        Produk
                      </th>
                      <th className="text-center py-2 px-4 text-[10px] font-bold text-gray-700 uppercase">
                        Qty
                      </th>
                      <th className="text-right py-2 px-4 text-[10px] font-bold text-gray-700 uppercase">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transaction.items.map((item, index) => (
                      <tr
                        key={index}
                        className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-2 px-4 text-xs text-gray-700">
                          {index + 1}
                        </td>
                        <td className="py-2 px-4">
                          <p className="text-xs font-semibold text-gray-800">
                            {item.product_name}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {item.product_code} •{" "}
                            {formatCurrency(item.price_at_transaction)}
                          </p>
                        </td>
                        <td className="py-2 px-4 text-center">
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold text-[10px]">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-xs text-right font-bold text-[#1a509a]">
                          {formatCurrency(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 font-medium">
                  Total Belanja
                </span>
                <span className="text-lg font-bold text-gray-800">
                  {formatCurrency(transaction.total_amount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 font-medium">
                  Uang Diterima
                </span>
                <span className="text-sm font-semibold text-blue-600">
                  {formatCurrency(transaction.cash_amount)}
                </span>
              </div>
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-bold text-sm">
                    Kembalian
                  </span>
                  <span className="text-xl font-black text-[#5cb338]">
                    {formatCurrency(transaction.change_amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions - Fixed Bottom */}
        <div className="p-5 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] text-white py-2.5 rounded-xl font-bold hover:shadow-lg transition-all text-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
