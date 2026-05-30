import React, {
  useState,
} from "react";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AttendanceRecordsPage from "./pages/AttendanceRecordsPage";
import ExportUserDataPage from "./pages/ExportUserDataPage";
import QRGenerationPage from "./pages/QRGenerationPage";
import UserManagementPage from "./pages/UserManagementPage";
import CreateUpdatePage from "./pages/CreateUpdatePage";

export default function App() {
  const [currentPage, setCurrentPage] =
    useState("login");

  const [currentUser, setCurrentUser] =
    useState(null);

  switch (currentPage) {
    case "login":
      return (
        <AdminLoginPage
          setCurrentPage={
            setCurrentPage
          }
          setCurrentUser={
            setCurrentUser
          }
        />
      );

    case "dashboard":
      return (
        <AdminDashboardPage
          currentUser={
            currentUser
          }
          setCurrentPage={
            setCurrentPage
          }
        />
      );

    case "attendanceCheck":
      return (
        <AttendanceRecordsPage
          setCurrentPage={
            setCurrentPage
          }
        />
      );

    case "exportData":
      return (
        <ExportUserDataPage
          setCurrentPage={
            setCurrentPage
          }
        />
      );

    case "qrGeneration":
      return (
        <QRGenerationPage
          setCurrentPage={
            setCurrentPage
          }
        />
      );

    case "createUpdate":
      return (
        <CreateUpdatePage
          setCurrentPage={
            setCurrentPage
          }
        />
      );

    case "userManagement":
      return (
        <UserManagementPage
          setCurrentPage={
            setCurrentPage
          }
        />
      );

    default:
      return (
        <AdminLoginPage
          setCurrentPage={
            setCurrentPage
          }
          setCurrentUser={
            setCurrentUser
          }
        />
      );
  }
}