import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaBarcode, FaQrcode, FaDownload } from "react-icons/fa";

export const BarcodeQRModal = ({ onClose, product }) => {
  const [activeTab, setActiveTab] = useState("barcode");
  const barcodeRef = useRef(null);
  const qrcodeRef = useRef(null);

  useEffect(() => {
    if (product) {
      if (activeTab === "barcode" && barcodeRef.current && window.JsBarcode) {
        try {
          barcodeRef.current.innerHTML = "";
          const svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
          );
          barcodeRef.current.appendChild(svg);

          window.JsBarcode(svg, product.kode, {
            format: "CODE128",
            width: 2,
            height: 60,
            displayValue: true,
            fontSize: 16,
            margin: 10,
          });
        } catch (error) {
          console.error("Error generating barcode:", error);
        }
      }

      if (activeTab === "qrcode" && qrcodeRef.current && window.QRCode) {
        try {
          qrcodeRef.current.innerHTML = "";
          new window.QRCode(qrcodeRef.current, {
            text: product.kode,
            width: 200,
            height: 200,
            colorDark: "#1a509a",
            colorLight: "#ffffff",
            correctLevel: window.QRCode.CorrectLevel.H,
          });
        } catch (error) {
          console.error("Error generating QR code:", error);
        }
      }
    }
  }, [product, activeTab]);

  const handleDownload = () => {
    const element =
      activeTab === "barcode" ? barcodeRef.current : qrcodeRef.current;
    if (!element) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (activeTab === "barcode") {
      const svg = element.querySelector("svg");
      if (!svg) return;

      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          const link = document.createElement("a");
          link.download = `barcode-${product.kode}.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(url);
        });
      };
      img.src = url;
    } else {
      const img = element.querySelector("img");
      if (!img) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        const link = document.createElement("a");
        link.download = `qrcode-${product.kode}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
      });
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] p-6 text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Generate Barcode & QR</h2>
            <p className="text-blue-100 text-sm mt-1">
              {product.nama} - {product.kode}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("barcode")}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === "barcode"
                  ? "bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <FaBarcode className="w-5 h-5" />
              Barcode
            </button>
            <button
              onClick={() => setActiveTab("qrcode")}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === "qrcode"
                  ? "bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <FaQrcode className="w-5 h-5" />
              QR Code
            </button>
          </div>

          {/* Display Area */}
          <div className="bg-gray-50 rounded-xl p-8 mb-6 min-h-[250px] flex items-center justify-center">
            {activeTab === "barcode" ? (
              <div
                ref={barcodeRef}
                className="flex items-center justify-center"
              ></div>
            ) : (
              <div
                ref={qrcodeRef}
                className="flex items-center justify-center"
              ></div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Nama Produk</p>
                <p className="font-semibold text-gray-800">{product.nama}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Merek</p>
                <p className="font-semibold text-gray-800">{product.merek}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Kode Produk</p>
                <p className="font-mono font-bold text-[#1a509a]">
                  {product.kode}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Harga</p>
                <p className="font-bold text-gray-800">
                  Rp {product.harga.toLocaleString("id-ID")},00
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
            >
              Tutup
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 bg-gradient-to-r from-[#5cb338] to-[#4d9a2e] text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <FaDownload className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
