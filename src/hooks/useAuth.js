import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";

export const useAuth = () => {
  const navigate = useNavigate();

  // Initialize state from localStorage
  const storedUser = localStorage.getItem("user");
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!storedUser);

  const login = async (username, password) => {
    console.log('=== FRONTEND LOGIN ===');
    console.log('API Endpoint:', API_ENDPOINTS.LOGIN);
    console.log('Username:', username);
    console.log('Password length:', password ? password.length : 0);
    
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.success) {
        const userData = {
          id: data.user.id,
          username: data.user.username,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          address: data.user.address,
          role: data.user.role,
          profile_picture: data.user.profile_picture,
        };
        console.log('Login berhasil, menyimpan user data:', userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        navigate("/dashboard");
        return { success: true };
      } else {
        console.log('Login gagal:', data.message);
        return { success: false, message: data.message || "Login gagal" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message:
          "Terjadi kesalahan saat login. Pastikan backend sudah berjalan.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  return { user, isAuthenticated, login, logout };
};
