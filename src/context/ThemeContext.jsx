// src/theme.js
import { createTheme } from "@mui/material/styles";

const rafikiOrange = "#ff7a00";
const rafikiDark = "#1f2d3d";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: rafikiOrange,
      contrastText: "#fff",
    },
    secondary: {
      main: "#0ea5e9", // used for follow state / accents
    },
    text: {
      primary: rafikiDark,
    },
    rafiki: {
      light: "#fff7f0",
      main: rafikiOrange,
      dark: "#b35000",
    },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 10, textTransform: "none", fontWeight: 600 },
      },
    },
  },
  typography: {
    fontFamily:
      'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
  },
});

export default theme;
