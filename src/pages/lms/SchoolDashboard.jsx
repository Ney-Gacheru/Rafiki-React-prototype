// src/pages/lms/SchoolDashboard.jsx
import React from "react";
import { Box, Typography, Paper } from "@mui/material";
// FIX: Removed .jsx extension
import NavBar from "../../components/NavBar";

export default function SchoolDashboard() {
  return (
    <Box sx={{ bgcolor: "#f7f7f8", minHeight: "100vh" }}>
      <NavBar />
      <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, md: 3 } }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
          School Dashboard
        </Typography>
        <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, mb: 3, boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Educator Overview</Typography>
          <Typography color="text.secondary">A list of all educators in this school would go here.</Typography>
        </Paper>
        <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, mb: 3, boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Student Progress Overview</Typography>
          <Typography color="text.secondary">A high-level dashboard of all student progress would go here.</Typography>
        </Paper>
      </Box>
    </Box>
  );
}