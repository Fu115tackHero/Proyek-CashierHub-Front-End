import { useState } from "react";
import { Modal } from "./Modal";
import { FaBox, FaBarcode, FaDollarSign, FaCubes } from "react-icons/fa";

const getInitialFormData = (product) => {
  if (product) {
    return {
      nama: product.nama || "",
      merek: product.merek || "",
      kode: product.kode || "",
      stok: product.stok?.toString() || "",
      harga: product.harga?.toString() || "",
    };
  }
  return {
    nama: "",
    merek: "",
    kode: "",
    stok: "",
    harga: "",
  };
};

export const ProductModal = ({ onClose, onSave, product = null }) => {
  const [formData, setFormData] = useState(() => getInitialFormData(product));
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nama.trim()) newErrors.nama = "Nama barang harus diisi";
    if (!formData.merek.trim()) newErrors.merek = "Merek harus diisi";
    if (!formData.kode.trim()) newErrors.kode = "Kode barang harus diisi";
    if (!formData.stok || formData.stok < 0)
      newErrors.stok = "Stok harus berupa angka positif";
    if (!formData.harga || formData.harga < 0)
      newErrors.harga = "Harga harus berupa angka positif";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const productData = {
        ...formData,
        stok: parseInt(formData.stok),
        harga: parseInt(formData.harga),
      };

      if (product) {
        productData.id = product.id;
      }

      onSave(productData);
      handleClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleClose = () => {
    setFormData({
      nama: "",
      merek: "",
      kode: "",
      stok: "",
      harga: "",
    });
    setErrors({});
    onClose();
  };

  const modalTitle = product ? "Edit Barang" : "Tambah Barang Baru";
  const submitButtonText = product ? "Simpan Perubahan" : "Tambah Barang";

  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      title={modalTitle}
      size="md"
      footer={
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold"
          >
            Batal
          </button>
          <button
            type="submit"
            form="product-form"
            className="px-5 py-2.5 bg-gradient-to-r from-[#5cb338] to-[#4d9a2e] text-white rounded-lg hover:shadow-lg transition-all font-semibold"
          >
            {submitButtonText}
          </button>
        </div>
      }
    >
      <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Nama Barang */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <FaBox className="inline mr-2 text-[#1a509a]" />
            Nama Barang
          </label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a509a] transition-all ${
              errors.nama ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Masukkan nama barang"
          />
          {errors.nama && (
            <p className="text-red-500 text-sm mt-1">{errors.nama}</p>
          )}
        </div>

        {/* Merek */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <FaBox className="inline mr-2 text-[#1a509a]" />
            Merek
          </label>
          <input
            type="text"
            name="merek"
            value={formData.merek}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a509a] transition-all ${
              errors.merek ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Masukkan merek barang"
          />
          {errors.merek && (
            <p className="text-red-500 text-sm mt-1">{errors.merek}</p>
          )}
        </div>

        {/* Kode Barang */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <FaBarcode className="inline mr-2 text-[#1a509a]" />
            Kode Barang
          </label>
          <input
            type="text"
            name="kode"
            value={formData.kode}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a509a] transition-all ${
              errors.kode ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Masukkan kode barang"
          />
          {errors.kode && (
            <p className="text-red-500 text-sm mt-1">{errors.kode}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Stok */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaCubes className="inline mr-2 text-[#1a509a]" />
              Stok
            </label>
            <input
              type="number"
              name="stok"
              value={formData.stok}
              onChange={handleChange}
              min="0"
              className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a509a] transition-all ${
                errors.stok ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="0"
            />
            {errors.stok && (
              <p className="text-red-500 text-sm mt-1">{errors.stok}</p>
            )}
          </div>

          {/* Harga */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaDollarSign className="inline mr-2 text-[#1a509a]" />
              Harga
            </label>
            <input
              type="number"
              name="harga"
              value={formData.harga}
              onChange={handleChange}
              min="0"
              className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a509a] transition-all ${
                errors.harga ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="0"
            />
            {errors.harga && (
              <p className="text-red-500 text-sm mt-1">{errors.harga}</p>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};
