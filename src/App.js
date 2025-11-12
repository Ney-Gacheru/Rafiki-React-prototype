import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { DataProvider } from "./context/DataContext.jsx";

/* Pages */
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import MarketHome from "./pages/market/MarketHome.jsx";
import LMSHome from "./pages/lms/LMSHome.jsx";
import Notifications from "./pages/Notifications.jsx";
import Messages from "./pages/Messages.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";

// 1. IMPORT NEW PLACEHOLDER PAGES
import Search from "./pages/Search.jsx";
import Ideas from "./pages/Ideas.jsx";
import Profile from "./pages/Profile.jsx";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Market area - MUST use /* to allow nested routes */}
        <Route path="/market/*" element={
          <ProtectedRoute>
            <MarketHome />
          </ProtectedRoute>
        } />

        {/* LMS area */}
        <Route path="/lms/*" element={
          <ProtectedRoute allowedRoles={["student","educator","school"]}>
            <LMSHome />
          </ProtectedRoute>
        } />

        {/* Admin area */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminPanel />
          </ProtectedRoute>
        } />

        {/* 2. ADD NEW PROTECTED TOP-LEVEL ROUTES */}
        <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/ideas" element={<ProtectedRoute><Ideas /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Shared pages */}
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}