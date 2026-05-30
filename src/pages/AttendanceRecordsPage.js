import React, {
  useEffect,
  useState,
} from "react";

import { supabase } from "../supabase";

import * as XLSX from "xlsx";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

export default function AttendanceRecordsPage({
  setCurrentPage,
}) {
  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [attendance, setAttendance] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [exportType, setExportType] =
    useState("");

  async function fetchAttendance() {
    if (!startDate || !endDate) {
      alert("Select dates");

      return;
    }

    setLoading(true);

    const { data, error } =
      await supabase

        .from("attendance")

        .select(`
          *,
          users (
            full_name
          )
        `)

        .gte(
          "session_date",
          startDate
        )

        .lte(
          "session_date",
          endDate
        )

        .order(
          "session_date",
          {
            ascending: true,
          }
        )

        .order(
          "login_time",
          {
            ascending: true,
          }
        );

    setLoading(false);

    if (error) {
      alert(error.message);

      return;
    }

    setAttendance(data || []);
  }

  function groupedAttendance() {
    const grouped = {};

    attendance.forEach((item) => {
      if (
        !grouped[
          item.session_date
        ]
      ) {
        grouped[
          item.session_date
        ] = [];
      }

      grouped[
        item.session_date
      ].push(item);
    });

    return grouped;
  }

  function formatDate(date) {
    return new Date(
      date
    ).toLocaleDateString(
      "en-GB"
    );
  }

  function formatTime(time) {
    if (!time) return "N/A";

    return new Date(
      time
    ).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  function exportExcel() {
    const wb =
      XLSX.utils.book_new();

    const rows = [];

    const grouped =
      groupedAttendance();

    Object.keys(grouped).forEach(
      (date) => {
        rows.push([
          formatDate(date),
          "",
          "",
        ]);

        rows.push([
          "Name",
          "Arrived",
          "Left",
        ]);

        grouped[date].forEach(
          (item) => {
            rows.push([
              item.users
                ?.full_name ||
                "N/A",

              formatTime(
                item.login_time
              ),

              formatTime(
                item.logout_time
              ),
            ]);
          }
        );

        rows.push([]);
      }
    );

    const ws =
      XLSX.utils.aoa_to_sheet(
        rows
      );

    ws["!cols"] = [
      { wch: 34 },
      { wch: 18 },
      { wch: 18 },
    ];

    const merges = [];

    let rowIndex = 0;

    Object.keys(grouped).forEach(
      (date) => {
        merges.push({
          s: {
            r: rowIndex,
            c: 0,
          },

          e: {
            r: rowIndex,
            c: 2,
          },
        });

        rowIndex +=
          grouped[date].length +
          3;
      }
    );

    ws["!merges"] = merges;

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      "Attendance"
    );

    XLSX.writeFile(
      wb,
      "attendance.xlsx"
    );
  }

  function exportPDF() {
    const doc = new jsPDF();

    let y = 20;

    const grouped =
      groupedAttendance();

    Object.keys(grouped).forEach(
      (date) => {
        doc.setFont(
          "times",
          "bold"
        );

        doc.setFontSize(20);

        doc.setTextColor(
          31,
          31,
          35
        );

        doc.text(
          formatDate(date),
          14,
          y
        );

        y += 8;

        autoTable(doc, {
          startY: y,

          styles: {
            font: "times",

            fontSize: 11,

            halign:
              "center",

            valign:
              "middle",

            textColor: [
              31, 31, 35,
            ],
          },

          headStyles: {
            fillColor: [
              31, 31, 35,
            ],

            textColor: 255,

            fontStyle:
              "bold",
          },

          alternateRowStyles: {
            fillColor: [
              245, 240, 235,
            ],
          },

          bodyStyles: {
            fillColor: [
              255, 255, 255,
            ],
          },

          head: [
            [
              "Name",
              "Arrived",
              "Left",
            ],
          ],

          body: grouped[
            date
          ].map((item) => [
            item.users
              ?.full_name ||
              "N/A",

            formatTime(
              item.login_time
            ),

            formatTime(
              item.logout_time
            ),
          ]),
        });

        y =
          doc.lastAutoTable
            .finalY + 18;
      }
    );

    doc.save(
      "attendance.pdf"
    );
  }

  useEffect(() => {
    if (exportType === "excel") {
      exportExcel();

      setExportType("");
    }

    if (exportType === "pdf") {
      exportPDF();

      setExportType("");
    }
  }, [exportType]);

  const grouped =
    groupedAttendance();

  return (
    <div
      style={{
        minHeight: "100vh",

        backgroundColor:
          "#f6f2ee",

        padding: "28px",

        fontFamily:
          "Inter, sans-serif",
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

          marginBottom: "28px",

          padding: 0,

          fontSize: "15px",
        }}
      >
        ← Back
      </button>

      <h1
        style={{
          fontFamily:
            "Playfair Display, serif",

          fontSize: "48px",

          marginTop: 0,

          marginBottom: "28px",

          color:
            "#1f1f23",
        }}
      >
        Attendance
      </h1>

      <div
        style={{
          backgroundColor:
            "white",

          borderRadius: "30px",

          padding: "24px",

          boxShadow:
            "0 10px 30px rgba(0,0,0,0.05)",

          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",

            flexDirection:
              "column",

            gap: "16px",
          }}
        >
          <input
            type="date"
            value={startDate}
            onChange={(e) =>
              setStartDate(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) =>
              setEndDate(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <button
            onClick={
              fetchAttendance
            }
            style={buttonStyle}
          >
            {loading
              ? "LOADING..."
              : "FETCH"}
          </button>

          <select
            value={exportType}
            onChange={(e) =>
              setExportType(
                e.target.value
              )
            }
            style={inputStyle}
          >
            <option value="">
              Export As
            </option>

            <option value="excel">
              Excel
            </option>

            <option value="pdf">
              PDF
            </option>
          </select>
        </div>
      </div>

      {Object.keys(grouped).map(
        (date) => (
          <div
            key={date}
            style={{
              backgroundColor:
                "white",

              borderRadius:
                "30px",

              padding: "24px",

              marginBottom:
                "24px",

              boxShadow:
                "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >
            <h2
              style={{
                marginTop: 0,

                marginBottom:
                  "20px",

                fontSize: "28px",

                color:
                  "#1f1f23",

                fontFamily:
                  "Playfair Display, serif",
              }}
            >
              {formatDate(date)}
            </h2>

            <div
              style={{
                display: "grid",

                gridTemplateColumns:
                  "1.5fr 1fr 1fr",

                gap: "12px",

                fontWeight:
                  "700",

                marginBottom:
                  "14px",

                color:
                  "#777",
              }}
            >
              <div>Name</div>

              <div>Arrived</div>

              <div>Left</div>
            </div>

            {grouped[
              date
            ].map((item) => (
              <div
                key={item.id}
                style={{
                  display:
                    "grid",

                  gridTemplateColumns:
                    "1.5fr 1fr 1fr",

                  gap: "12px",

                  padding:
                    "14px 0",

                  borderTop:
                    "1px solid #eee",
                }}
              >
                <div>
                  {item.users
                    ?.full_name ||
                    "N/A"}
                </div>

                <div>
                  {formatTime(
                    item.login_time
                  )}
                </div>

                <div>
                  {formatTime(
                    item.logout_time
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",

  padding: "16px",

  borderRadius: "18px",

  border:
    "1px solid #ddd",

  fontSize: "15px",

  boxSizing:
    "border-box",
};

const buttonStyle = {
  width: "100%",

  padding: "16px",

  borderRadius: "999px",

  border: "none",

  backgroundColor:
    "#1f1f23",

  color: "white",

  fontWeight: "600",

  cursor: "pointer",
};