import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { FaQrcode, FaTimes } from "react-icons/fa";

export const ScanQRModal = ({ onClose, onScanSuccess }) => {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState(null);
  const html5QrCodeRef = useRef(null);
  const isMountedRef = useRef(true);

  const startScanning = async () => {
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode("qr-reader");
      }

      setError(null);
      setScanning(true);

      const config = {
        fps: 10,
        qrbox: { width: 200, height: 200 },
        aspectRatio: 1.0,
      };

      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          if (!isMountedRef.current) return;
          setScannedData(decodedText);
          // Stop scanning after successful scan
          if (html5QrCodeRef.current) {
            html5QrCodeRef.current.stop().catch(() => {});
            setScanning(false);
          }
          if (onScanSuccess) {
            onScanSuccess(decodedText);
          }
        },
        () => {
          // Ignore scan errors (normal when no QR detected)
        }
      );
    } catch {
      if (isMountedRef.current) {
        setError("Gagal mengakses kamera. Pastikan izin kamera diaktifkan.");
        setScanning(false);
      }
    }
  };

  const stopScanning = async () => {
    try {
      if (html5QrCodeRef.current) {
        const state = html5QrCodeRef.current.getState();
        // Only stop if scanner is actually scanning (state 2 = SCANNING)
        if (state === 2) {
          await html5QrCodeRef.current.stop();
        }
        setScanning(false);
      }
    } catch {
      // Ignore errors, just set scanning to false
      setScanning(false);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    let cleanupExecuted = false;

    // Auto-start scanning when modal opens
    const initScanner = async () => {
      await startScanning();
    };

    initScanner();

    return () => {
      if (cleanupExecuted) return;
      cleanupExecuted = true;
      isMountedRef.current = false;

      // Cleanup scanner safely
      if (html5QrCodeRef.current) {
        try {
          const state = html5QrCodeRef.current.getState();
          // Only stop if scanning (state 2 = SCANNING)
          if (state === 2) {
            html5QrCodeRef.current.stop().catch(() => {});
          }
        } catch {
          // Ignore errors during cleanup
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = async () => {
    await stopScanning();
    setScannedData(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
      {/* Backdrop - Covers everything */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Modal - Above backdrop, below cart */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-xl font-bold">Scan QR Code / Barcode</h2>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-4">
            {/* QR Scanner Area */}
            <div className="bg-gray-100 rounded-xl p-4 relative">
              <div
                id="qr-reader"
                className="rounded-lg overflow-hidden relative"
                style={{ minHeight: scanning ? "240px" : "0px" }}
              >
                {/* Scanner Line Animation - hanya tampil saat scanning */}
                {scanning && (
                  <>
                    {/* Scanner Line - animasi bergerak naik turun */}
                    <div
                      className="scanner-line absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent"
                      style={{
                        zIndex: 10,
                        position: "absolute",
                        filter: "drop-shadow(0 0 8px rgba(34, 197, 94, 0.9))",
                      }}
                    />
                    {/* Scanner Corners - static, no animation */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="scanner-corner scanner-corner-tl" />
                      <div className="scanner-corner scanner-corner-tr" />
                      <div className="scanner-corner scanner-corner-bl" />
                      <div className="scanner-corner scanner-corner-br" />
                    </div>
                  </>
                )}
              </div>

              {!scanning && !scannedData && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FaQrcode className="w-24 h-24 text-gray-300 mb-4" />
                  <p className="text-gray-600 font-semibold mb-4">
                    Kamera akan aktif otomatis
                  </p>
                  <p className="text-gray-500 text-sm mb-6">
                    Arahkan kamera ke QR Code atau Barcode
                  </p>
                  <button
                    onClick={startScanning}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center gap-2"
                  >
                    <FaQrcode className="w-4 h-4" />
                    Mulai Scan
                  </button>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="font-semibold">{error}</p>
              </div>
            )}

            {/* Scanned Result */}
            {scannedData && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-bold text-green-800 mb-2">Hasil Scan:</h3>
                <p className="text-green-700 font-mono bg-white px-3 py-2 rounded border border-green-300">
                  {scannedData}
                </p>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Panduan:</h4>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>Pastikan QR Code/Barcode terlihat jelas di kamera</li>
                <li>Hindari pantulan cahaya yang berlebihan</li>
                <li>Jaga jarak yang cukup agar kode dapat terbaca</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-200">
          <div className="flex gap-3 justify-between">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold"
            >
              Tutup
            </button>
            <div className="flex gap-3">
              {!scanning && (
                <button
                  onClick={startScanning}
                  className="px-4 py-2 bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                >
                  Buka Kamera
                </button>
              )}
              {scanning && (
                <button
                  onClick={stopScanning}
                  className="px-4 py-2 bg-gradient-to-r from-[#d84040] to-[#c23636] text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                >
                  Stop Scan
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
