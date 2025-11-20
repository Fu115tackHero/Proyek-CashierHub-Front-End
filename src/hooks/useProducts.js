import { useState, useEffect } from "react";

const initialProducts = [
  {
    id: 1,
    nama: "Indomie Goreng",
    merek: "Indomie",
    kode: "123123",
    stok: 50,
    harga: 3000,
  },
  {
    id: 2,
    nama: "Chitato Sapi Panggang 55g",
    merek: "Indofood",
    kode: "213874",
    stok: 60,
    harga: 10000,
  },
  {
    id: 3,
    nama: "Chiki Balls 30g",
    merek: "Indofood",
    kode: "213477",
    stok: 60,
    harga: 5000,
  },
  {
    id: 4,
    nama: "Qtela Singkong Original 55g",
    merek: "Qtela",
    kode: "123276",
    stok: 60,
    harga: 8000,
  },
  {
    id: 5,
    nama: "Lay's Rumput Laut 68g",
    merek: "Lay's",
    kode: "126163",
    stok: 60,
    harga: 12000,
  },
  {
    id: 6,
    nama: "Taro Snack 40g",
    merek: "Taro",
    kode: "937842",
    stok: 60,
    harga: 6000,
  },
  {
    id: 7,
    nama: "Richeese Nabati 110g",
    merek: "Nabati",
    kode: "353454",
    stok: 60,
    harga: 12500,
  },
  {
    id: 8,
    nama: "Piattos Keju 50g",
    merek: "Piattos",
    kode: "12312312",
    stok: 60,
    harga: 7500,
  },
];

export const useProducts = () => {
  // Load from localStorage or use initial products
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("products");
      return saved ? JSON.parse(saved) : initialProducts;
    } catch (error) {
      console.error("Error loading products from localStorage:", error);
      return initialProducts;
    }
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const filteredProducts = products.filter(
    (product) =>
      product.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.merek.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.kode.includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Save to localStorage whenever products change
  useEffect(() => {
    try {
      localStorage.setItem("products", JSON.stringify(products));
    } catch (error) {
      console.error("Error saving products to localStorage:", error);
    }
  }, [products]);

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Math.max(...products.map((p) => p.id), 0) + 1,
    };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
  };

  const updateProduct = (updatedProduct) => {
    const updatedProducts = products.map((p) =>
      p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p
    );
    setProducts(updatedProducts);
  };

  const deleteProduct = (id) => {
    const updatedProducts = products.filter((p) => p.id !== id);
    setProducts(updatedProducts);
  };

  return {
    products: paginatedProducts,
    allProducts: filteredProducts,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
