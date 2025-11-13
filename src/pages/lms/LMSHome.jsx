// src/pages/lms/LMSHome.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import NavBar from "../../components/NavBar.jsx"; // We need NavBar on every page

export default function Search() {
  return (
    <Box>
      <NavBar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">LMS Page</Typography>
        <Typography>LMS content will go here.</Typography>
      </Box>
    </Box>
  );
}