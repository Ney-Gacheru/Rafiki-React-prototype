// src/pages/market/CreatePost.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

// This component lives *inside* the MarketHome layout
export default function CreatePost() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Create a new Post</Typography>
      <Typography>Form for creating a "For Sale" or "Request" post will go here.</Typography>
    </Box>
  );
}