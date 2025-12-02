import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { profileSvgPaths } from "../assets/svg-paths";
import { API_ENDPOINTS } from "../config/api";
import { useNotification } from "../hooks/useNotification";

export default function ProfilePage() {
  const navigate = useNavigate();
  const {
    showSuccess,
    showError,
    showWarning,
    showConfirmation,
    NotificationComponent,
  } = useNotification();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    idKasir: "",
    username: "",
    jabatan: "",
    passwordBaru: "",
    alamat: "",
    noTelepon: "",
    email: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setProfilePicture(userData.profile_picture || null);
        setFormData({
          nama: userData.name || "",
          idKasir: userData.id ? userData.id.toString().padStart(8, "0") : "",
          username: userData.username || "",
          jabatan: userData.role || "",
          passwordBaru: "",
          alamat: userData.address || "",
          noTelepon: userData.phone || "",
          email: userData.email || "",
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showWarning("File harus berupa gambar!");
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showWarning("Ukuran file maksimal 2MB!");
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPhoto = () => {
    document.getElementById("photoInput").click();
  };

  const handleDeletePhoto = () => {
    showConfirmation({
      title: "Hapus Foto Profil",
      message: "Apakah Anda yakin ingin menghapus foto profil?",
      onConfirm: () => {
        setProfilePicture(null);
      },
    });
  };

  const handleSave = async () => {
    if (!user || !user.id) {
      showError("User tidak ditemukan. Silakan login kembali.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        username: formData.username,
        name: formData.nama,
        email: formData.email,
        phone: formData.noTelepon || null,
        address: formData.alamat || null,
        role: formData.jabatan,
        profile_picture: profilePicture,
      };

      // Only include password if it's being changed
      if (formData.passwordBaru && formData.passwordBaru.trim() !== "") {
        payload.password = formData.passwordBaru;
      }

      console.log("Update Profile Payload:", payload);
      console.log("User ID:", user.id);

      const response = await fetch(`${API_ENDPOINTS.USERS}/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Update failed:", errorData);
        throw new Error(errorData.message || "Gagal mengupdate profil");
      }

      const result = await response.json();
      console.log("Update result:", result);

      // Update localStorage with new data
      const updatedUser = {
        ...user,
        name: result.name,
        username: result.username,
        email: result.email,
        phone: result.phone,
        address: result.address,
        role: result.role,
        profile_picture: result.profile_picture || profilePicture,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Trigger custom event to update Header in real-time
      window.dispatchEvent(new Event("profileUpdated"));

      // Clear password field
      setFormData((prev) => ({ ...prev, passwordBaru: "" }));

      showSuccess("Profil berhasil diperbarui!");
    } catch (error) {
      console.error("Error updating profile:", error);
      showError("Gagal memperbarui profil: " + error.message);
    } finally {
      setIsSaving(false);
    }
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
                <input
                  type="file"
                  id="photoInput"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />

                {/* PERUBAHAN: 
                    1. Menghapus class 'group' dari div parent agar tidak ada efek hover.
                    2. Menghapus div overlay kamera sepenuhnya.
                */}
                <div className="relative">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#1a509a] to-[#2d6bc4] p-1 shadow-xl">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                      {profilePicture ? (
                        <img
                          src={profilePicture}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
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
                      )}
                    </div>
                  </div>

                  {/* Overlay kamera dihapus di sini */}
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

                {profilePicture && (
                  <button
                    onClick={handleDeletePhoto}
                    className="bg-gradient-to-r from-[#d84040] to-[#c23636] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Hapus Foto
                  </button>
                )}
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
                      readOnly
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed"
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
                    disabled={isSaving}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Menyimpan...
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NotificationComponent />
    </div>
  );
}
