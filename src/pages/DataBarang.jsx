import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { Pagination } from "../components/Pagination";
import { useProducts } from "../hooks/useProducts";
import { useNavigate } from "react-router-dom";
import { ProductModal } from "../components/ProductModal";
import { BarcodeQRModal } from "../components/BarcodeQRModal";
import { ScanQRModal } from "../components/ScanQRModal";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBox,
  FaBarcode,
} from "react-icons/fa";

export default function DataBarang() {
  const navigate = useNavigate();
  const {
    products,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    deleteProduct,
    addProduct,
    updateProduct,
  } = useProducts();

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showBarcodeQRModal, setShowBarcodeQRModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showScanQRModal, setShowScanQRModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleDelete = (product) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${product.nama}?`)) {
      deleteProduct(product.id);
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }
  };

  const handleGenerateCode = (product) => {
    setSelectedProduct(product);
    setShowBarcodeQRModal(true);
  };

  const handleScanQRSuccess = (decodedText) => {
    const foundProduct = products.find(
      (p) => p.kode.toLowerCase() === decodedText.toLowerCase()
    );

    if (foundProduct) {
      setShowScanQRModal(false);
      setSearchQuery(decodedText);
      setCurrentPage(1);
    } else {
      alert("Produk tidak ditemukan!");
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 flex flex-col ml-56 overflow-hidden">
        <Header username="JoeMama" />

        <div className="flex-1 p-4 overflow-auto flex flex-col">
          <div className="mb-4 flex items-center gap-2">
            <div className="bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] p-2 rounded-lg shadow-md">
              <FaBox className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Kelola Barang</h1>
          </div>

          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari barang berdasarkan nama, merek, atau kode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl outline-none focus:border-[#1a509a] focus:ring-2 focus:ring-blue-100 transition-all text-sm"
              />
            </div>
            <button
              onClick={() => setShowScanQRModal(true)}
              className="bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all font-semibold flex items-center gap-2 text-sm"
            >
              <FaBarcode className="w-4 h-4" />
              Scan QR
            </button>
            <button
              onClick={handleAddNew}
              className="bg-gradient-to-r from-[#5cb338] to-[#4d9a2e] text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all font-semibold flex items-center gap-2 text-sm"
            >
              <FaPlus className="w-4 h-4" />
              Tambah Barang
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex-1 flex flex-col">
            <div
              className="overflow-auto flex-1"
              style={{ minHeight: "400px" }}
            >
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] sticky top-0">
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
                  {products.map((product, index) => (
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
                        Rp {product.harga.toLocaleString("id-ID")},00
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleGenerateCode(product)}
                            className="bg-gradient-to-r from-[#5cb338] to-[#4d9a2e] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:shadow-md transition-all flex items-center gap-1.5"
                          >
                            <FaBarcode className="w-3 h-3" />
                            QR/Barcode
                          </button>
                          <button
                            onClick={() => handleEdit(product)}
                            className="bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:shadow-md transition-all flex items-center gap-1.5"
                          >
                            <FaEdit className="w-3 h-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            className="bg-gradient-to-r from-[#d84040] to-[#c23636] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:shadow-md transition-all flex items-center gap-1.5"
                          >
                            <FaTrash className="w-3 h-3" />
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
      </div>

      {showProductModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => setShowProductModal(false)}
          onSave={handleSaveProduct}
        />
      )}

      {showBarcodeQRModal && selectedProduct && (
        <BarcodeQRModal
          product={selectedProduct}
          onClose={() => setShowBarcodeQRModal(false)}
        />
      )}

      {showScanQRModal && (
        <ScanQRModal
          onClose={() => setShowScanQRModal(false)}
          onScanSuccess={handleScanQRSuccess}
        />
      )}
    </div>
  );
}
