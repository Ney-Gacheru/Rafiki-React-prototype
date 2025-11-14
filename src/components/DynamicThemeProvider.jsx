// src/components/DynamicThemeProvider.jsx
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { marketTheme, lmsTheme } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

// Define which roles get which theme
const lmsRoles = ["student", "educator", "school"];

export default function DynamicThemeProvider({ children }) {
  const { currentUser } = useAuth();

  // Determine the theme
  const theme = (currentUser && lmsRoles.includes(currentUser.role))
    ? lmsTheme
    : marketTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}