import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExportUserDataPage({ setCurrentPage }) {
  const [users, setUsers] = useState([]);
  const [showFields, setShowFields] = useState(false);
  const [exportType, setExportType] = useState("");

  const allFields = [
    "enrollment_id",
    "full_name",
    "username",
    "email",
    "date_of_birth",
    "phone",
    "enrollment_date",
    "anniversary_date",
    "role"
  ];

  const [selectedFields, setSelectedFields] = useState(allFields);

  async function fetchUsers() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("full_name", { ascending: true });

    if (error) {
      alert(error.message);
      return;
    }

    setUsers(data || []);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  function toggleField(field) {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter((f) => f !== field));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  }

  function prettyLabel(field) {
    return field.replaceAll("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  }

  function formatValue(field, value) {
    if (value === null || value === undefined || value === "") return "N/A";

    if (field.includes("date")) {
      try {
        return new Date(value).toLocaleDateString("en-GB");
      } catch {
        return value;
      }
    }

    if (field.includes("time")) {
      try {
        return new Date(value).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit"
        });
      } catch {
        return value;
      }
    }

    return value;
  }

  function exportExcel() {
    const rows = users.map((user) => {
      const row = {};
      selectedFields.forEach((field) => {
        row[prettyLabel(field)] = formatValue(field, user[field]);
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = selectedFields.map(() => ({ wch: 28 }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "users.xlsx");
  }

  function exportPDF() {
    const doc = new jsPDF();
    doc.setFont("times", "bold");
    doc.setFontSize(22);
    doc.text("User Information", 14, 20);

    autoTable(doc, {
      startY: 30,
      styles: { font: "times", fontSize: 10, halign: "center", valign: "middle" },
      headStyles: { fillColor: [31, 31, 35], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 240, 235] },
      head: [selectedFields.map(prettyLabel)],
      body: users.map((user) =>
        selectedFields.map((field) => formatValue(field, user[field]))
      )
    });

    doc.save("users.pdf");
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

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f6f2ee",
        padding: "24px",
        fontFamily: "Inter, sans-serif",
        boxSizing: "border-box"
      }}
    >
      <button
        onClick={() => setCurrentPage("dashboard")}
        style={{
          background: "none",
          border: "none",
          color: "#777",
          cursor: "pointer",
          marginBottom: "24px",
          padding: 0,
          fontSize: "15px"
        }}
      >
        ← Back
      </button>

      <h1
        style={{
          fontFamily: "Playfair Display, serif",
          fontSize: "48px",
          marginTop: 0,
          marginBottom: "24px",
          color: "#1f1f23"
        }}
      >
        User Info
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          marginBottom: "24px"
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "24px",
            padding: "18px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
          }}
        >
          <button
            onClick={() => setShowFields(!showFields)}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "999px",
              border: "none",
              backgroundColor: "#1f1f23",
              color: "white",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Select Fields
          </button>

          {showFields && (
            <div
              style={{
                marginTop: "18px",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}
            >
              {allFields.map((field) => (
                <label
                  key={field}
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center"
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field)}
                    onChange={() => toggleField(field)}
                  />
                  {prettyLabel(field)}
                </label>
              ))}
            </div>
          )}
        </div>

        <select
          value={exportType}
          onChange={(e) => setExportType(e.target.value)}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "20px",
            border: "1px solid #ddd",
            fontSize: "15px",
            backgroundColor: "white"
          }}
        >
          <option value="">Export As</option>
          <option value="excel">Excel</option>
          <option value="pdf">PDF</option>
        </select>
      </div>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "30px",
          padding: "20px",
          overflowX: "auto",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse"
          }}
        >
          <thead>
            <tr>
              {selectedFields.map((field) => (
                <th
                  key={field}
                  style={{
                    textAlign: "left",
                    padding: "14px",
                    borderBottom: "1px solid #eee",
                    color: "#777"
                  }}
                >
                  {prettyLabel(field)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                {selectedFields.map((field) => (
                  <td
                    key={field}
                    style={{
                      padding: "14px",
                      borderBottom: "1px solid #f2f2f2"
                    }}
                  >
                    {formatValue(field, user[field])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}