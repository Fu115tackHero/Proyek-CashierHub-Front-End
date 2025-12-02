import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

/**
 * NotificationModal Component
 *
 * Modal untuk menampilkan notifikasi yang sinkron dengan response backend
 * - success (200-299): Hijau
 * - error (400-599): Merah
 * - warning: Kuning
 * - info: Biru
 */
export const NotificationModal = ({
  isOpen,
  onClose,
  type = "info",
  title,
  message,
  autoClose = false,
  autoCloseDuration = 3000,
}) => {
  // Auto close feature
  if (autoClose && isOpen) {
    setTimeout(() => {
      onClose();
    }, autoCloseDuration);
  }

  if (!isOpen) return null;

  const variants = {
    success: {
      icon: FaCheckCircle,
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      buttonColor:
        "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
    },
    error: {
      icon: FaExclamationCircle,
      iconColor: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      buttonColor:
        "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
    },
    warning: {
      icon: FaExclamationTriangle,
      iconColor: "text-yellow-500",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      buttonColor:
        "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700",
    },
    info: {
      icon: FaInfoCircle,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      buttonColor:
        "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    },
  };

  const currentVariant = variants[type] || variants.info;
  const Icon = currentVariant.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideInUp">
        {/* Icon & Title */}
        <div
          className={`${currentVariant.bgColor} ${currentVariant.borderColor} border-2 rounded-t-2xl p-6`}
        >
          <div className="flex items-center gap-4">
            <Icon className={`w-12 h-12 ${currentVariant.iconColor}`} />
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          </div>
        </div>

        {/* Message */}
        <div className="p-6">
          <p className="text-gray-700 text-lg leading-relaxed">{message}</p>
        </div>

        {/* Button */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className={`w-full py-3 px-6 ${currentVariant.buttonColor} text-white rounded-xl font-semibold shadow-lg transition-all duration-200`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * ConfirmationModal Component
 *
 * Modal untuk konfirmasi dengan tombol Ya/Tidak
 */
export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Ya",
  cancelText = "Tidak",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideInUp">
        {/* Icon & Title */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-t-2xl p-6">
          <div className="flex items-center gap-4">
            <FaExclamationTriangle className="w-12 h-12 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          </div>
        </div>

        {/* Message */}
        <div className="p-6">
          <p className="text-gray-700 text-lg leading-relaxed">{message}</p>
        </div>

        {/* Buttons */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-all duration-200"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] hover:from-[#143d7a] hover:to-[#1a509a] text-white rounded-xl font-semibold shadow-lg transition-all duration-200"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Helper function untuk menentukan type berdasarkan HTTP status code
 */
export const getNotificationTypeFromStatus = (statusCode) => {
  if (statusCode >= 200 && statusCode < 300) return "success";
  if (statusCode >= 400 && statusCode < 500) return "warning";
  if (statusCode >= 500) return "error";
  return "info";
};
