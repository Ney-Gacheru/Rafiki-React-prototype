// src/components/NavBar.jsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MessageIcon from "@mui/icons-material/Message";
import { useNavigate, Link as RouterLink } from "react-router-dom";

export default function NavBar() {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogoutConfirm = () => {
    setLogoutOpen(false);
    localStorage.removeItem("currentUser");
    navigate("/", { replace: true });
  };

  // NAVBAR HEIGHT (used by layout to offset content)
  const NAV_HEIGHT = 64;

  return (
    <>
      <AppBar
        position="fixed"           // fixed so it never scrolls
        elevation={0}
        sx={{
          top: 0,
          height: NAV_HEIGHT,
          bgcolor: "rgba(255,255,255,0.96)",
          color: "#111",
          backdropFilter: "blur(4px)",
          borderBottom: "1px solid rgba(0,0,0,0.04)",
          zIndex: 1400,
          justifyContent: "center",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", height: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <RouterLink to="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
              <img src="/R-logo.png" alt="rafiki logo" style={{ width: 60, height: 60 }} />
            </RouterLink>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              aria-label="messages"
              component={RouterLink}
              to="/messages"
              size="large"
            >
              <MessageIcon />
            </IconButton>

            <IconButton
              aria-label="notifications"
              component={RouterLink}
              to="/notifications"
              size="large"
            >
              <NotificationsNoneIcon />
            </IconButton>

            {user ? (
              <Button
                onClick={() => setLogoutOpen(true)}
                sx={{ textTransform: "none" }}
              >
                {user.name}
              </Button>
            ) : (
              <Button component={RouterLink} to="/login" sx={{ textTransform: "none" }}>
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* small spacer so page content isn't behind the fixed navbar */}
      <Box sx={{ height: `${NAV_HEIGHT}px`, width: "100%" }} />

      <Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)}>
        <DialogTitle>Confirm logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleLogoutConfirm}>Logout</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
