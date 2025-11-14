// src/context/ThemeContext.jsx
import { createTheme } from "@mui/material/styles";

// 1. Define the Market theme (default orange)
export const marketTheme = createTheme({
  palette: {
    primary: {
      main: "#ff7a00", // Rafiki Orange
    },
    secondary: {
      main: "#4b5563", // Gray
    },
    background: {
      default: "#f7f7f8", // Light gray background
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    h6: { fontWeight: 700 },
    subtitle2: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// 2. Define the LMS theme (blue)
export const lmsTheme = createTheme({
  palette: {
    primary: {
      main: "#3b82f6", // CodeCraft Blue
    },
    secondary: {
      main: "#4b5563", // Gray
    },
    background: {
      default: "#f9fafb", // Lighter gray background
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    h6: { fontWeight: 700 },
    subtitle2: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});