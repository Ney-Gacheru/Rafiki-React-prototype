// src/components/TaskPostCard.jsx
import React from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  Chip
} from "@mui/material";

// This is a simple card for showing a Task
export default function TaskPostCard({ task }) {

  return (
    <Box
      sx={{
        borderRadius: 2.5,
        boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
        p: 2,
        background: "#fff"
      }}
    >
      <Stack spacing={1}>
        <Chip 
          label={task.courseName || "CodeCraft Task"} 
          size="small" 
          color="primary"
          variant="outlined"
          sx={{ width: 'fit-content', fontWeight: 600 }} 
        />
        
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {task.title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Posted by {task.educator}
        </Typography>

        <Typography sx={{ mt: 1, fontSize: 15, lineHeight: 1.45, color: "#333", whiteSpace: 'pre-wrap' }}>
          {task.text}
        </Typography>
        
        <Box sx={{ pt: 1 }}>
          <Button 
            variant="contained" 
            onClick={() => console.log("View Task / Submit (placeholder)")}
          >
            View Task
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}