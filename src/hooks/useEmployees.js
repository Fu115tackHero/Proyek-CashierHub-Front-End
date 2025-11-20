import { useState, useEffect } from "react";

const initialEmployees = [
  {
    id: 1,
    nama: "Ahmad Fadli",
    email: "ahmad@cashierhub.com",
    telepon: "081234567890",
    alamat: "Jl. Merdeka No. 123, Jakarta",
    posisi: "Kasir",
    password: "ahmad123",
  },
  {
    id: 2,
    nama: "Siti Nurhaliza",
    email: "siti@cashierhub.com",
    telepon: "082345678901",
    alamat: "Jl. Sudirman No. 45, Bandung",
    posisi: "Kasir",
    password: "siti123",
  },
  {
    id: 3,
    nama: "Budi Santoso",
    email: "budi@cashierhub.com",
    telepon: "083456789012",
    alamat: "Jl. Gatot Subroto No. 67, Surabaya",
    posisi: "Admin",
    password: "budi123",
  },
];

export const useEmployees = () => {
  // Load from localStorage or use initial employees
  const [employees, setEmployees] = useState(() => {
    try {
      const saved = localStorage.getItem("employees");
      return saved ? JSON.parse(saved) : initialEmployees;
    } catch (error) {
      console.error("Error loading employees from localStorage:", error);
      return initialEmployees;
    }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.posisi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Save to localStorage whenever employees change
  useEffect(() => {
    try {
      localStorage.setItem("employees", JSON.stringify(employees));
    } catch (error) {
      console.error("Error saving employees to localStorage:", error);
    }
  }, [employees]);

  const addEmployee = (employee) => {
    const newId =
      employees.length > 0 ? Math.max(...employees.map((e) => e.id)) + 1 : 1;
    const newEmployee = {
      ...employee,
      id: newId,
    };
    const updatedEmployees = [...employees, newEmployee];
    setEmployees(updatedEmployees);
  };

  const updateEmployee = (updatedEmployee) => {
    const updatedEmployees = employees.map((emp) =>
      emp.id === updatedEmployee.id ? { ...emp, ...updatedEmployee } : emp
    );
    setEmployees(updatedEmployees);
  };

  const deleteEmployee = (id) => {
    const updatedEmployees = employees.filter((emp) => emp.id !== id);
    setEmployees(updatedEmployees);
  };

  return {
    employees: paginatedEmployees,
    allEmployees: filteredEmployees,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  };
};
