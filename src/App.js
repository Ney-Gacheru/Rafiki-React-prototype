import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./context/ThemeContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { DataProvider } from "./context/DataContext";

/* Pages - create files in src/pages/... or use placeholders */
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MarketHome from "./pages/market/MarketHome";
import LMSHome from "./pages/lms/LMSHome";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import AdminPanel from "./pages/AdminPanel";

export default function App() {
  return (
 <ThemeProvider theme={theme}>
   <CssBaseline /> 
    <DataProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Market area - any logged in user can access */}
          <Route path="/market/*" element={
            <ProtectedRoute>
              <MarketHome />
            </ProtectedRoute>
          } />

          {/* LMS area - restrict to LMS roles (student/educator/school) */}
          <Route path="/lms/*" element={
            <ProtectedRoute allowedRoles={["student","educator","school"]}>
              <LMSHome />
            </ProtectedRoute>
          } />

          {/* Admin area - admin only */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPanel />
            </ProtectedRoute>
          } />

          {/* Shared pages */}
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </DataProvider>
  </ ThemeProvider >
    
  );
}
