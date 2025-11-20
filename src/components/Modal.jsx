import React from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  variant = "default",
  size = "md",
  showCloseButton = true,
  footer,
}) => {
  if (!isOpen) return null;

  const variants = {
    success: {
      icon: FaCheckCircle,
      iconColor: "text-green-500",
      headerBg: "bg-gradient-to-r from-green-500 to-green-600",
    },
    error: {
      icon: FaExclamationCircle,
      iconColor: "text-red-500",
      headerBg: "bg-gradient-to-r from-red-500 to-red-600",
    },
    warning: {
      icon: FaExclamationTriangle,
      iconColor: "text-yellow-500",
      headerBg: "bg-gradient-to-r from-yellow-500 to-yellow-600",
    },
    info: {
      icon: FaInfoCircle,
      iconColor: "text-blue-500",
      headerBg: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    default: {
      icon: null,
      iconColor: "",
      headerBg: "bg-gradient-to-r from-[#1a509a] to-[#2d6bc4]",
    },
  };

  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full mx-4",
  };

  const currentVariant = variants[variant] || variants.default;
  const Icon = currentVariant.icon;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl ${sizes[size]} w-full max-h-[90vh] flex flex-col animate-slideInUp`}
      >
        {/* Header */}
        <div
          className={`${currentVariant.headerBg} text-white px-6 py-4 rounded-t-2xl flex items-center justify-between`}
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon className="w-6 h-6" />}
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-200">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// Alert Modal untuk notifikasi cepat
export const AlertModal = ({
  isOpen,
  onClose,
  title,
  message,
  variant = "info",
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      variant={variant}
      size="sm"
      footer={
        <div className="flex gap-3 justify-end">
          {onConfirm && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold"
              >
                Batal
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] text-white rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                Konfirmasi
              </button>
            </>
          )}
          {!onConfirm && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] text-white rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              OK
            </button>
          )}
        </div>
      }
    >
      <p className="text-gray-700">{message}</p>
    </Modal>
  );
};
