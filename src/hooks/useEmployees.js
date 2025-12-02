import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config/api";

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Fetch employees from API
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.USERS);
      if (!response.ok) {
        throw new Error("Gagal mengambil data karyawan");
      }
      const data = await response.json();

      // Ensure data is an array
      if (!Array.isArray(data)) {
        console.error("API returned non-array data:", data);
        setEmployees([]);
        return;
      }

      // Transform backend data to frontend format
      const transformedData = data.map((user) => ({
        id: user.id,
        nama: user.name,
        email: user.email,
        telepon: user.phone || "",
        alamat: user.address || "",
        posisi: user.role,
        username: user.username,
        idKasir: user.id.toString().padStart(8, "0"), // Format ID dengan padding
      }));

      setEmployees(transformedData);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter and pagination
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.posisi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.username &&
        emp.username.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Add employee - POST to API
  const addEmployee = async (employeeData) => {
    try {
      const payload = {
        username: employeeData.username,
        password: employeeData.password,
        name: employeeData.nama,
        email: employeeData.email,
        phone: employeeData.telepon || null,
        address: employeeData.alamat || null,
        role: employeeData.posisi,
      };

      console.log("Adding employee with payload:", payload);

      const response = await fetch(API_ENDPOINTS.USERS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        throw new Error(
          errorData.error || errorData.message || "Gagal menambah karyawan"
        );
      }

      const result = await response.json();
      await fetchEmployees(); // Refresh data
      return { success: true, data: result };
    } catch (error) {
      console.error("Error adding employee:", error);
      return { success: false, error: error.message };
    }
  };

  // Update employee - PUT to API
  const updateEmployee = async (employeeData) => {
    try {
      const payload = {
        username: employeeData.username,
        name: employeeData.nama,
        email: employeeData.email,
        phone: employeeData.telepon || null,
        address: employeeData.alamat || null,
        role: employeeData.posisi,
      };

      // Only include password if it's being changed
      if (employeeData.password && employeeData.password.trim() !== "") {
        payload.password = employeeData.password;
      }

      console.log("Update Employee Payload:", payload);
      console.log("Employee ID:", employeeData.id);

      const response = await fetch(
        `${API_ENDPOINTS.USERS}/${employeeData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Update failed:", errorData);
        throw new Error(errorData.message || "Gagal mengupdate karyawan");
      }

      const result = await response.json();
      console.log("Update result:", result);
      await fetchEmployees(); // Refresh data
      return { success: true, data: result };
    } catch (error) {
      console.error("Error updating employee:", error);
      return { success: false, error: error.message };
    }
  };

  // Delete employee - DELETE from API
  const deleteEmployee = async (id) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.USERS}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menghapus karyawan");
      }

      await fetchEmployees(); // Refresh data
      return { success: true };
    } catch (error) {
      console.error("Error deleting employee:", error);
      return { success: false, error: error.message };
    }
  };

  return {
    employees: paginatedEmployees,
    allEmployees: filteredEmployees,
    loading,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    refreshEmployees: fetchEmployees,
  };
};
