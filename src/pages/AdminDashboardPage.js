import React from "react";

import {
  ClipboardCheck,
  QrCode,
  IdCard,
  ShieldCheck,
  Newspaper,
} from "lucide-react";

export default function AdminDashboardPage({
  currentUser,
  setCurrentPage,
}) {
  const cards = [
    {
      title: "Check Attendance",

      icon: (
        <ClipboardCheck
          size={54}
          strokeWidth={2}
        />
      ),

      page: "attendanceCheck",
    },

    {
      title: "QR Code",

      icon: (
        <QrCode
          size={54}
          strokeWidth={2}
        />
      ),

      page: "qrGeneration",
    },

    {
      title: "User Info",

      icon: (
        <IdCard
          size={54}
          strokeWidth={2}
        />
      ),

      page: "exportData",
    },

    {
      title: "Manage Roles",

      icon: (
        <ShieldCheck
          size={54}
          strokeWidth={2}
        />
      ),

      page: "userManagement",
    },

    {
      title: "Create Updates",

      icon: (
        <Newspaper
          size={54}
          strokeWidth={2}
        />
      ),

      page: "createUpdate",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",

        backgroundColor:
          "#f6f2ee",

        padding: "20px",

        boxSizing:
          "border-box",

        fontFamily:
          "Inter, sans-serif",

        overflowX: "hidden",
      }}
    >
      <button
        onClick={() =>
          setCurrentPage(
            "login"
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
        ← Logout
      </button>

      <h1
        style={{
          fontFamily:
            "Playfair Display, serif",

          fontSize: "52px",

          lineHeight: 1,

          marginTop: 0,

          marginBottom: "10px",

          color:
            "#1f1f23",

          wordBreak:
            "break-word",
        }}
      >
        {currentUser
          ?.full_name ||
          "Admin"}
      </h1>

      <p
        style={{
          color: "#777",

          fontSize: "17px",

          marginBottom: "28px",
        }}
      >
        SNSD Admin Portal
      </p>

      <div
        style={{
          display: "flex",

          flexDirection:
            "column",

          gap: "18px",

          width: "100%",
        }}
      >
        {cards.map((card) => (
          <button
            key={card.title}
            onClick={() =>
              setCurrentPage(
                card.page
              )
            }
            style={{
              backgroundColor:
                "white",

              border: "none",

              borderRadius:
                "34px",

              width: "100%",

              height: "190px",

              padding: "20px",

              display: "flex",

              flexDirection:
                "column",

              justifyContent:
                "center",

              alignItems:
                "center",

              gap: "20px",

              cursor: "pointer",

              boxSizing:
                "border-box",

              boxShadow:
                "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                color:
                  "#1f1f23",
              }}
            >
              {card.icon}
            </div>

            <div
              style={{
                fontSize: "20px",

                fontWeight:
                  "700",

                textAlign:
                  "center",

                lineHeight:
                  "1.25",

                color:
                  "#1f1f23",
              }}
            >
              {card.title}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}