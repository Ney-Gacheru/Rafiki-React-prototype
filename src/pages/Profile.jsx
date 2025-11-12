// src/pages/Profile.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import NavBar from "../components/NavBar.jsx";

export default function Profile() {
  return (
    <Box>
      <NavBar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">Profile Page</Typography>
        <Typography>User profile content will go here.</Typography>
      </Box>
    </Box>
  );
}