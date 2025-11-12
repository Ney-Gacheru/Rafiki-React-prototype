// src/pages/Ideas.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import NavBar from "../components/NavBar.jsx";

export default function Ideas() {
  return (
    <Box>
      <NavBar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">Ideas Page</Typography>
        <Typography>Ideas content will go here.</Typography>
      </Box>
    </Box>
  );
}