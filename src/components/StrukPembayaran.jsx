import React, { useRef } from "react";
import { FaTimes, FaPrint } from "react-icons/fa";
import imgLogo from "figma:asset/91293b9b3a4aed9fdd1e62c0fc9c74efae4bcd9b.png";

export const StrukPembayaran = ({
  items,
  total,
  cash,
  change,
  date,
  onClose,
  employeeName = "JoeMama",
  employeeAddress = "Universitas USU",
}) => {
  const printContentRef = useRef(null);

  const handlePrint = () => {
    const printContent = printContentRef.current.innerHTML;
    const printWindow = window.open("", "", "width=302,height=600");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Struk Pembayaran</title>
          <style>
            @page {
              size: 90mm auto;
              margin: 0;
            }
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Courier New', monospace;
              width: 90mm;
              margin: 0 auto;
              padding: 5mm;
              background: white;
            }
            
            .text-center { text-align: center; }
            .mb-1 { margin-bottom: 4px; }
            .mb-2 { margin-bottom: 8px; }
            .mb-3 { margin-bottom: 12px; }
            .pb-2 { padding-bottom: 8px; }
            .pt-2 { padding-top: 8px; }
            .border-b { border-bottom: 2px dashed #333; }
            .border-t { border-top: 2px dashed #333; }
            .font-bold { font-weight: bold; }
            .text-xs { font-size: 10px; }
            .text-sm { font-size: 11px; }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 8px;
              table-layout: fixed;
            }
            
            colgroup col:nth-child(1) { width: 45%; }
            colgroup col:nth-child(2) { width: 10%; }
            colgroup col:nth-child(3) { width: 20%; }
            colgroup col:nth-child(4) { width: 25%; }
            
            th, td {
              text-align: left;
              padding: 4px 2px;
              font-size: 10px;
              white-space: nowrap;
            }
            
            th {
              border-bottom: 1px solid #333;
              font-weight: bold;
            }
            
            th:first-child { padding-left: 0; padding-right: 2px; }
            th:last-child { padding-right: 0; padding-left: 2px; }
            td:first-child { 
              padding-left: 0; 
              padding-right: 2px;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            td:last-child { padding-right: 0; padding-left: 2px; }
            
            .text-right { text-align: right; }
            
            img {
              max-width: 60px;
              height: auto;
              margin: 0 auto 8px;
              display: block;
            }
            
            .total-row {
              font-weight: bold;
              font-size: 11px;
              border-top: 2px solid #333;
              padding-top: 8px;
              margin-top: 8px;
            }
            
            .flex {
              display: flex;
              justify-content: space-between;
              margin-bottom: 4px;
            }
            
            @media print {
              body {
                width: 72mm;
                margin: 0 auto;
              }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full overflow-hidden flex flex-col"
        style={{ maxWidth: "600px", maxHeight: "90vh" }}
      >
        <div className="bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] p-4 text-white flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold">Struk Pembayaran</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Struk Content - This will be printed - SCROLLABLE */}
        <div className="overflow-y-auto flex-1">
          <div
            ref={printContentRef}
            className="p-6 bg-white mx-auto"
            style={{
              width: "90mm",
              fontFamily: "'Courier New', monospace",
            }}
          >
            <div
              className="text-center mb-3 pb-2"
              style={{ borderBottom: "2px dashed #333" }}
            >
              <img
                src={imgLogo}
                alt="CashierHub Logo"
                style={{
                  maxWidth: "60px",
                  height: "auto",
                  margin: "0 auto 8px",
                  display: "block",
                }}
              />
              <h1
                style={{
                  fontSize: "11px",
                  fontWeight: "bold",
                  marginBottom: "4px",
                }}
              >
                Internal Retail Management
              </h1>
              <p style={{ fontSize: "10px", marginBottom: "2px" }}>
                Toko: GPT STORE
              </p>
              <p style={{ fontSize: "10px", marginBottom: "2px" }}>
                {employeeAddress}
              </p>
              <p style={{ fontSize: "10px", marginBottom: "2px" }}>
                Telp: 021-12345678
              </p>
            </div>

            <div
              className="mb-2 pb-2"
              style={{
                borderBottom: "2px dashed #333",
                fontSize: "10px",
                marginBottom: "8px",
              }}
            >
              <p style={{ marginBottom: "4px" }}>
                Tanggal: {date || new Date().toLocaleString("id-ID")}
              </p>
              <p>Kasir: {employeeName}</p>
            </div>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "8px",
                tableLayout: "fixed",
              }}
            >
              <colgroup>
                <col style={{ width: "45%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "25%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "4px 2px 4px 0",
                      fontSize: "10px",
                      borderBottom: "1px solid #333",
                      fontWeight: "bold",
                    }}
                  >
                    Item
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "4px 2px",
                      fontSize: "10px",
                      borderBottom: "1px solid #333",
                      fontWeight: "bold",
                    }}
                  >
                    Qty
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "4px 2px",
                      fontSize: "10px",
                      borderBottom: "1px solid #333",
                      fontWeight: "bold",
                    }}
                  >
                    Harga
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "4px 0 4px 2px",
                      fontSize: "10px",
                      borderBottom: "1px solid #333",
                      fontWeight: "bold",
                    }}
                  >
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {items &&
                  items.map((item, index) => (
                    <tr key={index}>
                      <td 
                        style={{ 
                          fontSize: "10px", 
                          padding: "4px 2px 4px 0",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.nama}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          fontSize: "10px",
                          padding: "4px 2px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.quantity}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          fontSize: "10px",
                          padding: "4px 2px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.harga.toLocaleString("id-ID")},00
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          fontSize: "10px",
                          fontWeight: "bold",
                          padding: "4px 0 4px 2px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Rp{" "}{(item.harga * item.quantity).toLocaleString("id-ID")},00
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <div
              style={{
                fontWeight: "bold",
                fontSize: "11px",
                borderTop: "2px solid #333",
                paddingTop: "8px",
                marginTop: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "4px",
                }}
              >
                <span style={{ fontSize: "10px" }}>TOTAL:</span>
                <span style={{ fontSize: "11px" }}>
                  Rp {total.toLocaleString("id-ID")},00
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "4px",
                }}
              >
                <span style={{ fontSize: "10px" }}>Tunai:</span>
                <span style={{ fontSize: "10px" }}>
                  Rp {cash.toLocaleString("id-ID")},00
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "10px" }}>Kembali:</span>
                <span style={{ fontSize: "10px" }}>
                  Rp {change.toLocaleString("id-ID")},00
                </span>
              </div>
            </div>

            <div
              style={{
                textAlign: "center",
                marginTop: "12px",
                fontSize: "10px",
                borderTop: "2px dashed #333",
                paddingTop: "8px",
              }}
            >
              <p style={{ fontWeight: "bold", marginBottom: "4px" }}>
                Terima Kasih!
              </p>
              <p>Barang yang sudah dibeli tidak dapat dikembalikan</p>
            </div>
          </div>
        </div>

        {/* Print Button */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handlePrint}
            className="w-full bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <FaPrint className="w-5 h-5" />
            Cetak Struk
          </button>
        </div>
      </div>
    </div>
  );
};
