import React from "react";

import { QRCodeCanvas } from "qrcode.react";

export default function QRGenerationPage({
  setCurrentPage,
}) {
  const permanentQR =
    "SNSD_ATTENDANCE";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f6f2ee",
        padding: "20px",
        fontFamily:
          "Inter, sans-serif",
        boxSizing: "border-box",

        display: "flex",
        justifyContent:
          "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
        }}
      >
        <button
          onClick={() =>
            setCurrentPage(
              "dashboard"
            )
          }
          style={{
            background: "none",
            border: "none",
            color: "#777",
            cursor: "pointer",
            marginBottom: "18px",
            padding: 0,
            fontSize: "15px",
          }}
        >
          ← Back
        </button>

        <div
          style={{
            backgroundColor:
              "white",

            borderRadius: "32px",

            padding: "24px",

            boxShadow:
              "0 10px 30px rgba(0,0,0,0.05)",

            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontFamily:
                "Playfair Display, serif",

              fontSize: "38px",

              marginTop: 0,

              marginBottom:
                "22px",

              color:
                "#1f1f23",
            }}
          >
            Attendance QR
          </h1>

          <div
            style={{
              display: "flex",
              justifyContent:
                "center",
            }}
          >
            <div
              style={{
                backgroundColor:
                  "white",

                padding: "16px",

                borderRadius:
                  "28px",

                border:
                  "1px solid #eee",
              }}
            >
              <QRCodeCanvas
                value={permanentQR}
                size={220}
              />
            </div>
          </div>

          <h2
            style={{
              marginTop: "24px",

              marginBottom:
                "10px",

              color:
                "#1f1f23",

              fontSize: "26px",
            }}
          >
            Permanent QR
          </h2>

          <p
            style={{
              margin: 0,

              color: "#777",

              lineHeight:
                "1.7",

              fontSize: "15px",
            }}
          >
            Members scan this QR
            when arriving and
            leaving to record
            attendance.
          </p>

          <div
            style={{
              marginTop: "20px",

              backgroundColor:
                "#f3eee9",

              padding: "14px",

              borderRadius:
                "18px",

              fontSize: "13px",

              color: "#555",

              wordBreak:
                "break-word",
            }}
          >
            <strong>
              SNSD_ATTENDANCE
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}