import { useState, useEffect, useCallback, useMemo } from "react";
import { API_ENDPOINTS } from "../config/api";

export const useProducts = (options = {}) => {
  const { hideOutOfStock = false } = options; // Default: tampilkan semua produk
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Default true saat mount
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // 1. FIX: Tambahkan parameter withLoading (default true)
  // Fetch products from API
  const fetchProducts = useCallback(async (withLoading = true) => {
    try {
      // Hanya set loading true jika diminta (menghindari loop di useEffect)
      if (withLoading) {
        setLoading(true);
      }

      const response = await fetch(API_ENDPOINTS.PRODUCTS);
      const data = await response.json();

      // Ensure data is an array
      if (!Array.isArray(data)) {
        console.error("API returned non-array data:", data);
        setAllProducts([]);
        return;
      }

      // Transform data dari backend ke format frontend
      const transformedData = data.map((product) => ({
        id: product.id,
        nama: product.name,
        jenis: product.type, // type digunakan sebagai jenis
        kode: product.code,
        stok: product.stock,
        harga: parseFloat(product.price),
      }));

      setAllProducts(transformedData);
    } catch (error) {
      console.error("Error fetching products:", error);
      // Fallback to empty array
      setAllProducts([]);
    } finally {
      // Pastikan loading mati di sini (sukses maupun error)
      setLoading(false);
    }
  }, []);

  // 2. FIX: Panggil dengan false saat Mount
  // Load products on mount
  useEffect(() => {
    fetchProducts(false);
  }, [fetchProducts]);

  // Filter products based on search query AND optionally exclude out of stock
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Filter by search query
      // FIX: Convert kode to string to handle numeric codes consistently
      const matchesSearch =
        product.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.jenis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(product.kode).toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by stock if hideOutOfStock is true
      const hasStock = hideOutOfStock ? product.stok > 0 : true;

      return matchesSearch && hasStock;
    });
  }, [allProducts, searchQuery, hideOutOfStock]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredProducts, currentPage]);

  // Add Product
  const addProduct = async (productData) => {
    try {
      const payload = {
        name: productData.nama,
        type: productData.jenis,
        code: productData.kode,
        stock: parseInt(productData.stok),
        price: parseFloat(productData.harga),
      };

      const response = await fetch(API_ENDPOINTS.PRODUCTS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Refresh products list (pakai default true agar loading muncul sebentar)
        await fetchProducts();
        return { success: true };
      } else {
        const error = await response.json();
        return {
          success: false,
          message: error.error || "Gagal menambah produk",
        };
      }
    } catch (error) {
      console.error("Error adding product:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat menambah produk",
      };
    }
  };

  // Update Product
  const updateProduct = async (productData) => {
    try {
      const payload = {
        name: productData.nama,
        type: productData.jenis,
        code: productData.kode,
        stock: parseInt(productData.stok),
        price: parseFloat(productData.harga),
      };

      const response = await fetch(
        `${API_ENDPOINTS.PRODUCTS}/${productData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        // Refresh products list
        await fetchProducts();
        return { success: true };
      } else {
        const error = await response.json();
        return {
          success: false,
          message: error.error || "Gagal mengupdate produk",
        };
      }
    } catch (error) {
      console.error("Error updating product:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat mengupdate produk",
      };
    }
  };

  // Delete Product
  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.PRODUCTS}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh products list
        await fetchProducts();
        return { success: true };
      } else {
        const error = await response.json();
        return {
          success: false,
          message: error.error || "Gagal menghapus produk",
        };
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat menghapus produk",
      };
    }
  };

  // Memoized refresh to avoid recreating on every render (prevents effect loops & repeated listeners)
  const refreshProducts = useCallback(() => {
    fetchProducts(true);
  }, [fetchProducts]);

  return {
    products: paginatedProducts,
    allProducts: filteredProducts,
    loading,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
  };
};
