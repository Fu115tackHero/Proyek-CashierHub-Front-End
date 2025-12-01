import { useState } from "react";

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      // Validasi: quantity di keranjang tidak boleh melebihi stok database
      if (existingItem.quantity >= product.stok) {
        alert(
          `Stok ${product.nama} tidak mencukupi! Tersisa ${product.stok} di database.`
        );
        return;
      }
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      if (product.stok < 1) {
        alert(`Stok ${product.nama} habis!`);
        return;
      }
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity, maxStok) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    // Validasi stok jika maxStok diberikan
    if (maxStok !== undefined && quantity > maxStok) {
      alert(`Quantity tidak boleh melebihi stok tersedia (${maxStok})`);
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const incrementQuantity = (productId, maxStok) => {
    const item = cartItems.find((i) => i.id === productId);
    if (item) {
      // Validasi stok sebelum increment
      if (maxStok !== undefined && item.quantity >= maxStok) {
        alert(`Stok tidak mencukupi! Maksimal ${maxStok} item.`);
        return;
      }
      updateQuantity(productId, item.quantity + 1, maxStok);
    }
  };

  const decrementQuantity = (productId) => {
    const item = cartItems.find((i) => i.id === productId);
    if (item) {
      updateQuantity(productId, item.quantity - 1);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.harga * item.quantity,
      0
    );
  };

  // Hitung stok tersisa untuk produk tertentu (stok database - quantity di keranjang)
  const getAvailableStock = (productId, databaseStock) => {
    const cartItem = cartItems.find((item) => item.id === productId);
    return databaseStock - (cartItem ? cartItem.quantity : 0);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getAvailableStock,
  };
};
