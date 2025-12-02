import { useState } from "react";
import { NotificationModal, ConfirmationModal } from "../components/NotificationModal";

/**
 * Custom hook untuk mengelola notifikasi modal
 */
export const useNotification = () => {
  const [notification, setNotification] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // Show notification
  const showNotification = ({ type = "info", title, message, autoClose = false, autoCloseDuration = 3000 }) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message,
      autoClose,
      autoCloseDuration,
    });
  };

  // Show success notification
  const showSuccess = (message, title = "Berhasil!") => {
    showNotification({ type: "success", title, message });
  };

  // Show error notification
  const showError = (message, title = "Terjadi Kesalahan!") => {
    showNotification({ type: "error", title, message });
  };

  // Show warning notification
  const showWarning = (message, title = "Peringatan!") => {
    showNotification({ type: "warning", title, message });
  };

  // Show info notification
  const showInfo = (message, title = "Informasi") => {
    showNotification({ type: "info", title, message });
  };

  // Show confirmation dialog
  const showConfirmation = ({ title, message, onConfirm, confirmText, cancelText }) => {
    setConfirmation({
      isOpen: true,
      title,
      message,
      onConfirm,
      confirmText,
      cancelText,
    });
  };

  // Close notification
  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isOpen: false }));
  };

  // Close confirmation
  const closeConfirmation = () => {
    setConfirmation((prev) => ({ ...prev, isOpen: false }));
  };

  // Render components
  const NotificationComponent = () => (
    <>
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        autoClose={notification.autoClose}
        autoCloseDuration={notification.autoCloseDuration}
      />
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={closeConfirmation}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title}
        message={confirmation.message}
        confirmText={confirmation.confirmText}
        cancelText={confirmation.cancelText}
      />
    </>
  );

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirmation,
    NotificationComponent,
  };
};
