import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { Pagination } from "../components/Pagination";
import { FaChartBar, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";

const transactions = [
  {
    id: 1,
    tanggal: "18/11/2025",
    kasir: "Ahmad",
    produk: "Indomie Goreng",
    jumlah: 3,
    harga: 3000,
    subtotal: 9000,
  },
  {
    id: 2,
    tanggal: "18/11/2025",
    kasir: "Ahmad",
    produk: "Chitato Sapi Panggang 55g",
    jumlah: 2,
    harga: 10000,
    subtotal: 20000,
  },
  {
    id: 3,
    tanggal: "17/11/2025",
    kasir: "Budi",
    produk: "Lay's Rumput Laut 68g",
    jumlah: 4,
    harga: 12000,
    subtotal: 48000,
  },
  {
    id: 4,
    tanggal: "17/11/2025",
    kasir: "Budi",
    produk: "Chiki Balls 30g",
    jumlah: 5,
    harga: 5000,
    subtotal: 25000,
  },
  {
    id: 5,
    tanggal: "11/11/2025",
    kasir: "Citra",
    produk: "Taro Snack 40g",
    jumlah: 6,
    harga: 6000,
    subtotal: 36000,
  },
  {
    id: 6,
    tanggal: "11/11/2025",
    kasir: "Citra",
    produk: "Indomie Goreng",
    jumlah: 10,
    harga: 3000,
    subtotal: 30000,
  },
  {
    id: 7,
    tanggal: "05/11/2025",
    kasir: "Dewi",
    produk: "Chitato Sapi Panggang 55g",
    jumlah: 3,
    harga: 10000,
    subtotal: 30000,
  },
  {
    id: 8,
    tanggal: "05/11/2025",
    kasir: "Dewi",
    produk: "Lay's Rumput Laut 68g",
    jumlah: 2,
    harga: 12000,
    subtotal: 24000,
  },
  {
    id: 9,
    tanggal: "28/10/2025",
    kasir: "Eka",
    produk: "Chiki Balls 30g",
    jumlah: 8,
    harga: 5000,
    subtotal: 40000,
  },
  {
    id: 10,
    tanggal: "15/10/2025",
    kasir: "Fajar",
    produk: "Taro Snack 40g",
    jumlah: 5,
    harga: 6000,
    subtotal: 30000,
  },
  {
    id: 11,
    tanggal: "10/10/2025",
    kasir: "Gita",
    produk: "Indomie Goreng",
    jumlah: 15,
    harga: 3000,
    subtotal: 45000,
  },
  {
    id: 12,
    tanggal: "05/10/2025",
    kasir: "Hadi",
    produk: "Chitato Sapi Panggang 55g",
    jumlah: 4,
    harga: 10000,
    subtotal: 40000,
  },
  {
    id: 13,
    tanggal: "28/09/2025",
    kasir: "Indah",
    produk: "Lay's Rumput Laut 68g",
    jumlah: 3,
    harga: 12000,
    subtotal: 36000,
  },
  {
    id: 14,
    tanggal: "20/09/2025",
    kasir: "Joko",
    produk: "Chiki Balls 30g",
    jumlah: 6,
    harga: 5000,
    subtotal: 30000,
  },
  {
    id: 15,
    tanggal: "15/09/2025",
    kasir: "Kiki",
    produk: "Taro Snack 40g",
    jumlah: 7,
    harga: 6000,
    subtotal: 42000,
  },
  {
    id: 16,
    tanggal: "10/09/2025",
    kasir: "Lina",
    produk: "Indomie Goreng",
    jumlah: 20,
    harga: 3000,
    subtotal: 60000,
  },
  {
    id: 17,
    tanggal: "05/09/2025",
    kasir: "Mira",
    produk: "Chitato Sapi Panggang 55g",
    jumlah: 5,
    harga: 10000,
    subtotal: 50000,
  },
  {
    id: 18,
    tanggal: "25/08/2025",
    kasir: "Nana",
    produk: "Lay's Rumput Laut 68g",
    jumlah: 4,
    harga: 12000,
    subtotal: 48000,
  },
  {
    id: 19,
    tanggal: "10/01/2024",
    kasir: "Omar",
    produk: "Indomie Goreng",
    jumlah: 12,
    harga: 3000,
    subtotal: 36000,
  },
];

export default function RiwayatTransaksi() {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState("default");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currentPage, setCurrentPage] = useState(1);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const getFilteredTransactions = () => {
    if (filterType === "default") {
      return transactions;
    }

    return transactions.filter((trans) => {
      const [day, month, year] = trans.tanggal.split("/");
      const transDate = new Date(year, month - 1, day);
      const now = new Date();

      if (filterType === "daily") {
        const [selYear, selMonth, selDay] = selectedDate.split("-");
        return day === selDay && month === selMonth && year === selYear;
      } else if (filterType === "weekly") {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - 7);
        return transDate >= weekStart && transDate <= now;
      } else if (filterType === "monthly") {
        return (
          parseInt(month) === selectedMonth && parseInt(year) === selectedYear
        );
      } else if (filterType === "yearly") {
        return parseInt(year) === selectedYear;
      }
      return true;
    });
  };

  const filteredTransactions = getFilteredTransactions();
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPendapatan = filteredTransactions.reduce(
    (sum, t) => sum + t.subtotal,
    0
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 flex flex-col ml-56 overflow-hidden">
        <Header username="JoeMama" />

        <div className="flex-1 p-4 overflow-auto">
          <div className="mb-4 flex items-center gap-2">
            <div className="bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] p-2 rounded-lg shadow-md">
              <FaChartBar className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Data Penjualan</h1>
          </div>

          <div className="flex gap-3 mb-4 flex-wrap">
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a509a] w-4 h-4 pointer-events-none z-10" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] text-white border-none rounded-lg pl-10 pr-10 py-2.5 text-sm font-bold appearance-none cursor-pointer hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#2d6bc4]"
                style={{ minWidth: "180px" }}
              >
                <option value="default" className="bg-white text-gray-800">
                  Default (Semua)
                </option>
                <option value="daily" className="bg-white text-gray-800">
                  Harian
                </option>
                <option value="weekly" className="bg-white text-gray-800">
                  Mingguan
                </option>
                <option value="monthly" className="bg-white text-gray-800">
                  Bulanan
                </option>
                <option value="yearly" className="bg-white text-gray-800">
                  Tahunan
                </option>
              </select>
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none w-4 h-4 text-white z-10"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            {filterType === "daily" && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-[#1a509a] transition-all focus:outline-none focus:ring-2 focus:ring-[#1a509a]"
              />
            )}

            {(filterType === "monthly" || filterType === "weekly") && (
              <>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="bg-white border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 appearance-none cursor-pointer hover:border-[#1a509a] transition-all focus:outline-none focus:ring-2 focus:ring-[#1a509a]"
                >
                  <option value={1}>Januari</option>
                  <option value={2}>Februari</option>
                  <option value={3}>Maret</option>
                  <option value={4}>April</option>
                  <option value={5}>Mei</option>
                  <option value={6}>Juni</option>
                  <option value={7}>Juli</option>
                  <option value={8}>Agustus</option>
                  <option value={9}>September</option>
                  <option value={10}>Oktober</option>
                  <option value={11}>November</option>
                  <option value={12}>Desember</option>
                </select>
                <input
                  type="number"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  min="2020"
                  max="2030"
                  className="bg-white border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-[#1a509a] transition-all focus:outline-none focus:ring-2 focus:ring-[#1a509a]"
                  style={{ width: "100px" }}
                />
              </>
            )}

            {filterType === "yearly" && (
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                min="2020"
                max="2030"
                className="bg-white border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-[#1a509a] transition-all focus:outline-none focus:ring-2 focus:ring-[#1a509a]"
                style={{ width: "100px" }}
              />
            )}
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden flex flex-col">
            <div className="overflow-auto" style={{ minHeight: "400px" }}>
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
                      Produk
                    </th>
                    <th className="text-left py-4 px-6 font-bold text-white uppercase tracking-wider text-sm">
                      Jumlah Beli
                    </th>
                    <th className="text-left py-4 px-6 font-bold text-white uppercase tracking-wider text-sm">
                      Harga
                    </th>
                    <th className="text-left py-4 px-6 font-bold text-white uppercase tracking-wider text-sm">
                      Sub Total
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
                      <td className="py-4 px-6 font-medium text-gray-800">
                        {transaction.produk}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold text-sm">
                          {transaction.jumlah}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-[#1a509a]">
                        Rp {transaction.harga.toLocaleString("id-ID")},00
                      </td>
                      <td className="py-4 px-6 font-bold text-[#5cb338]">
                        Rp {transaction.subtotal.toLocaleString("id-ID")},00
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
              <div className="flex justify-end">
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
    </div>
  );
}
