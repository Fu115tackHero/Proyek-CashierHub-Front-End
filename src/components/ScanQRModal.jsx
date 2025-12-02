import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { FaQrcode, FaTimes } from "react-icons/fa";

export const ScanQRModal = ({
  onClose,
  onScanSuccess,
  fromCart = false,
  isProcessing = false,
}) => {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState(null);
  const [cooldown, setCooldown] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState("");
  const [successFeedback, setSuccessFeedback] = useState(null);
  const html5QrCodeRef = useRef(null);
  const isMountedRef = useRef(true);
  const audioRef = useRef(null);
  const restartTimeoutRef = useRef(null);

  // Function to play beep sound - bisa pakai file MP3 atau Web Audio API
  const playBeep = () => {
    try {
      // CARA 1: Pakai file MP3 (uncomment code ini dan comment code Web Audio API)
      // if (audioRef.current) {
      //   audioRef.current.currentTime = 0;
      //   audioRef.current.play().catch(() => {});
      // }

      // CARA 2: Web Audio API (default)
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();

      const playTone = (freq, start, duration, type = "square") => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0, ctx.currentTime + start);
        gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + start + 0.01);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + start + duration
        );
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration + 0.01);
      };

      playTone(1700, 0.0, 0.06, "square");
      playTone(1100, 0.08, 0.06, "square");
    } catch (error) {
      // Ignore audio errors
    }
  };

  const startScanning = async () => {
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode("qr-reader");
      }

      setError(null);
      setScanning(true);

      const config = {
        fps: 15,
        qrbox: (viewfinderWidth, viewfinderHeight) => {
          // Dynamic qrbox size based on viewfinder
          const minEdgePercentage = 0.7; // 70% of the smaller edge
          const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
          const qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
          return {
            width: qrboxSize,
            height: qrboxSize,
          };
        },
        aspectRatio: 1.0,
        // Support QR + common retail barcodes
        formatsToSupport: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.CODE_93,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.ITF,
          Html5QrcodeSupportedFormats.CODABAR,
          Html5QrcodeSupportedFormats.DATA_MATRIX,
          Html5QrcodeSupportedFormats.AZTEC,
        ],
        // Improve detection stability
        disableFlip: true,
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true,
        },
        // Prefer rear camera with decent resolution
        videoConstraints: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        config,
        async (decodedText) => {
          // CRITICAL: Check cooldown PERTAMA sebelum apapun!
          if (!isMountedRef.current || cooldown) {
            console.log("Scan ignored - cooldown active");
            return;
          }

          // Set cooldown SEBELUM proses apapun
          setCooldown(true);

          // Play beep sound
          playBeep();

          setScannedData(decodedText);
          setLastScannedCode(decodedText);

          // Jika scan dari cart, PAUSE scanner sementara
          if (fromCart) {
            // Stop scanner
            if (html5QrCodeRef.current) {
              html5QrCodeRef.current.stop().catch(() => {});
              setScanning(false);
            }

            // Call success handler AND WAIT FOR RESULT
            let result = { success: true }; // Default true if no return
            if (onScanSuccess) {
              const res = await onScanSuccess(decodedText);
              if (res) result = res;
            }

            if (result.success) {
              // Show success feedback ONLY if success
              setSuccessFeedback(result.message || decodedText);
            } else {
              // Show error feedback if failed
              setError(result.message || "Gagal memproses scan");
            }

            // Auto-restart scanner setelah 1.8 detik
            restartTimeoutRef.current = setTimeout(async () => {
              setSuccessFeedback(null);
              setError(null); // Clear error too
              setCooldown(false);
              // Restart scanner
              await startScanning();
            }, 1800);
          } else {
            // Scan dari pencarian - langsung stop dan close
            if (onScanSuccess) {
              onScanSuccess(decodedText);
            }
            if (html5QrCodeRef.current) {
              html5QrCodeRef.current.stop().catch(() => {});
              setScanning(false);
            }
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

      // Clear restart timeout
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }

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
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center p-4 ${
        fromCart ? "pr-[340px]" : ""
      }`}
    >
      {/* Audio element untuk MP3 - uncomment dan set src ke file MP3 */}
      {/* <audio ref={audioRef} src="/sounds/beep.mp3" preload="auto" /> */}

      {/* Backdrop - z-40 to cover everything including header, cart is z-50 so stays above */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Processing Overlay - tampil saat sedang memproses scan */}
      {isProcessing && fromCart && (
        <div className="absolute inset-0 z-45 flex items-center justify-center">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-pulse">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="font-bold">Menambahkan ke keranjang...</span>
          </div>
        </div>
      )}

      {/* Modal - z-50, above everything */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col z-50">
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

              {!scanning && !scannedData && !successFeedback && (
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

              {/* Success Feedback - tampil saat pause */}
              {successFeedback && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
                    <svg
                      className="w-12 h-12 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <p className="text-green-600 font-bold text-lg mb-2">
                    ✓ Berhasil Ditambahkan!
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    Kode:{" "}
                    <span className="font-mono font-bold">
                      {successFeedback}
                    </span>
                  </p>
                  <p className="text-gray-500 text-xs">
                    Menunggu scan berikutnya...
                  </p>
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
