import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config/api";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.PRODUCTS);
      const data = await response.json();

      // Transform data dari backend ke format frontend
      const transformedData = data.map((product) => ({
        id: product.id,
        nama: product.name,
        merek: product.type, // type digunakan sebagai merek
        kode: product.code,
        stok: product.stock,
        harga: parseFloat(product.price),
      }));

      setAllProducts(transformedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
      // Fallback to empty array
      setAllProducts([]);
    }
  };

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search query
  const filteredProducts = allProducts.filter(
    (product) =>
      product.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.merek.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.kode.includes(searchQuery)
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Add Product
  const addProduct = async (productData) => {
    try {
      const payload = {
        name: productData.nama,
        type: productData.merek,
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
        // Refresh products list
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
        type: productData.merek,
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
    refreshProducts: fetchProducts,
  };
};
