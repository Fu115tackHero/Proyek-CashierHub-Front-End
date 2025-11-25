import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { profileSvgPaths } from "../assets/svg-paths";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "Joe Mama",
    idKasir: "411550343",
    username: "Joe Mama",
    jabatan: "Kasir",
    passwordBaru: "",
    alamat: "Universitas USU",
    noTelepon: "08237438726",
    email: "joemama@gmail.com",
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    alert("Perubahan berhasil disimpan!");
    console.log("Data profile:", formData);
  };

  const handleUploadPhoto = () => {
    alert("Fitur upload foto akan diimplementasikan");
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 flex flex-col ml-56 overflow-hidden">
        <Header />

        <div className="flex-1 overflow-y-auto p-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Profil Saya</h1>
          <p className="text-gray-600 mb-8">
            Kelola informasi pribadi dan keamanan akun Anda
          </p>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex gap-10">
              {/* Photo Section */}
              <div className="flex flex-col items-center gap-5">
                <div className="relative group">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#1a509a] to-[#2d6bc4] p-1 shadow-xl">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                      <svg
                        className="w-32 h-32 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 258 258"
                      >
                        <path
                          clipRule="evenodd"
                          d={profileSvgPaths.pcbca680}
                          fillRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                </div>
                <button
                  onClick={handleUploadPhoto}
                  className="bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Ubah Foto
                </button>
                <div className="text-center mt-2">
                  <p className="text-2xl font-bold text-gray-800">
                    {formData.nama}
                  </p>
                  <span className="inline-block mt-2 px-4 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                    {formData.jabatan}
                  </span>
                </div>
              </div>

              {/* Form Section */}
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-6">
                  {/* Nama */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={formData.nama}
                      onChange={(e) => handleChange("nama", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  {/* ID Kasir */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ID Kasir
                    </label>
                    <input
                      type="text"
                      value={formData.idKasir}
                      onChange={(e) => handleChange("idKasir", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleChange("username", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  {/* Jabatan/Posisi */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Jabatan/Posisi
                    </label>
                    <input
                      type="text"
                      value={formData.jabatan}
                      readOnly
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  {/* Password Baru */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password Baru
                    </label>
                    <input
                      type="password"
                      value={formData.passwordBaru}
                      onChange={(e) =>
                        handleChange("passwordBaru", e.target.value)
                      }
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  {/* No Telepon */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      No. Telepon
                    </label>
                    <input
                      type="tel"
                      value={formData.noTelepon}
                      onChange={(e) =>
                        handleChange("noTelepon", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  {/* Alamat */}
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Alamat Lengkap
                    </label>
                    <textarea
                      value={formData.alamat}
                      onChange={(e) => handleChange("alamat", e.target.value)}
                      rows="3"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
