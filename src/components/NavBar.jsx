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

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "rgba(255,255,255,0.96)",
          color: "#111",
          backdropFilter: "blur(4px)",
          borderBottom: "1px solid rgba(0,0,0,0.04)"
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <RouterLink to="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
              <img src="/logo192.png" alt="rafiki logo" style={{ width: 36, height: 36 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, ml: 1, color: "inherit" }}>
                Rafiki
              </Typography>
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
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

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
