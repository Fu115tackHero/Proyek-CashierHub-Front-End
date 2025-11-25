import { useState } from "react";
import { useNavigate } from "react-router-dom";

const getUserFromStorage = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return {
        username: user.name || user.username || "User",
        role: user.role || "",
      };
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }
  return { username: "User", role: "" };
};

export const Header = () => {
  const navigate = useNavigate();
  const [username] = useState(() => getUserFromStorage().username);
  const [role] = useState(() => getUserFromStorage().role);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-end gap-2 py-2 px-6">
        <button
          onClick={handleProfileClick}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
        >
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800 group-hover:text-[#1a509a] transition-colors">
              {username}
            </p>
            {role && (
              <p className="text-xs text-gray-500 group-hover:text-[#1a509a] transition-colors">
                {role}
              </p>
            )}
          </div>
          <div className="bg-gradient-to-br from-[#1a509a] to-[#2d6bc4] p-1.5 rounded-full group-hover:shadow-md group-hover:scale-105 transition-all">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 25 25"
            >
              <path d="M12.5 4.16667C11.5331 4.16667 10.6057 4.55078 9.92201 5.23451C9.23828 5.91823 8.85417 6.84557 8.85417 7.8125C8.85417 8.77944 9.23828 9.70677 9.92201 10.3905C10.6057 11.0742 11.5331 11.4583 12.5 11.4583C13.4669 11.4583 14.3943 11.0742 15.078 10.3905C15.7617 9.70677 16.1458 8.77944 16.1458 7.8125C16.1458 6.84557 15.7617 5.91823 15.078 5.23451C14.3943 4.55078 13.4669 4.16667 12.5 4.16667ZM6.77083 7.8125C6.77083 6.29303 7.37444 4.83579 8.44887 3.76137C9.52329 2.68694 10.9805 2.08333 12.5 2.08333C14.0195 2.08333 15.4767 2.68694 16.5511 3.76137C17.6256 4.83579 18.2292 6.29303 18.2292 7.8125C18.2292 9.33197 17.6256 10.7892 16.5511 11.8636C15.4767 12.9381 14.0195 13.5417 12.5 13.5417C10.9805 13.5417 9.52329 12.9381 8.44887 11.8636C7.37444 10.7892 6.77083 9.33197 6.77083 7.8125ZM3.125 19.7917C3.125 18.4103 3.67373 17.0856 4.65049 16.1088C5.62724 15.1321 6.952 14.5833 8.33333 14.5833H16.6667C18.048 14.5833 19.3728 15.1321 20.3495 16.1088C21.3263 17.0856 21.875 18.4103 21.875 19.7917V22.9167H3.125V19.7917ZM8.33333 16.6667C7.50453 16.6667 6.70968 16.9959 6.12362 17.582C5.53757 18.168 5.20833 18.9629 5.20833 19.7917V20.8333H19.7917V19.7917C19.7917 18.9629 19.4624 18.168 18.8764 17.582C18.2903 16.9959 17.4955 16.6667 16.6667 16.6667H8.33333Z" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};
