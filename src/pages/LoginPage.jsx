import { useState } from "react";
import { useNavigate } from "react-router-dom";
import imgImage2 from "figma:asset/267f62b7f53369d61a610b218f5c7653c8862403.png";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Dummy users for testing (matching server dummy data)
  const dummyUsers = [
    {
      username: "admin",
      password: "admin123",
      role: "Admin",
      nama_lengkap: "Administrator",
    },
    {
      username: "kasir01",
      password: "kasir123",
      role: "Kasir",
      nama_lengkap: "Budi Santoso",
    },
  ];

  const handleLogin = () => {
    if (!username || !password) {
      setError("Mohon isi username dan password");
      return;
    }

    // Find user from dummy data
    const user = dummyUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      // Save user data to localStorage (including role)
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: user.username,
          name: user.nama_lengkap,
          role: user.role,
        })
      );

      // Redirect to dashboard
      navigate("/dashboard");
    } else {
      setError("Username atau password salah!");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100 animate-gradient"></div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* White Card Container with Glass Effect */}
      <div
        className="relative z-10 bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl flex overflow-hidden border border-white/20 transform hover:scale-[1.01] transition-all duration-500"
        style={{ width: "1000px", height: "600px" }}
      >
        {/* Left Side - Logo */}
        <div className="w-[45%] flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-12 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(26,80,154,0.05),transparent)]"></div>
          <div className="w-full max-w-[350px] relative z-10 transform hover:scale-105 transition-transform duration-500">
            <img
              alt="CashierHub Logo"
              className="w-full h-auto object-contain drop-shadow-2xl"
              src={imgImage2}
            />
          </div>
        </div>

        {/* Right Side - Login Form on Blue Background */}
        <div className="w-[55%] bg-gradient-to-br from-[#1a509a] via-[#2b5ca8] to-[#1e4a8a] flex items-center justify-center p-12 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

          <div className="w-full max-w-md relative z-10">
            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-red-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-xl shadow-lg animate-shake">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Info Message */}
            <div className="mb-6 bg-white/10 backdrop-blur-sm text-white px-4 py-3 rounded-xl shadow-lg">
              <p className="text-xs font-medium mb-1">Demo Login:</p>
              <p className="text-xs">Admin: admin / admin123</p>
              <p className="text-xs">Kasir: kasir01 / kasir123</p>
            </div>

            {/* Username */}
            <div className="mb-6">
              <label className="block text-white text-lg font-semibold mb-3 tracking-wide">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Masukkan username"
                  className="w-full bg-white/95 backdrop-blur-sm rounded-xl pl-12 pr-4 py-3.5 text-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white transition-all shadow-lg"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-8">
              <label className="block text-white text-lg font-semibold mb-3 tracking-wide">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Masukkan password"
                  className="w-full bg-white/95 backdrop-blur-sm rounded-xl pl-12 pr-4 py-3.5 text-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white transition-all shadow-lg"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-white to-blue-50 hover:from-blue-50 hover:to-white text-[#1a509a] text-xl font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg
                  className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Login
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>

            {/* Additional Info */}
            <p className="text-center text-white/80 text-sm mt-6 font-medium">
              Selamat datang di CashierHub
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
