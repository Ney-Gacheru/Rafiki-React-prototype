// src/components/SideNav.jsx
import React from "react";
import { Box, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate, useLocation } from "react-router-dom"; // 1. IMPORT ROUTER HOOKS

// 2. DEFINE NAVIGATION ITEMS
const navItems = [
  { text: "Home", icon: <HomeIcon />, path: "/market" },
  { text: "Search", icon: <SearchIcon />, path: "/search" },
  { text: "Post", icon: <AddCircleOutlineIcon />, path: "/market/create" },
  { text: "Ideas", icon: <LightbulbIcon />, path: "/ideas" },
  { text: "Profile", icon: <AccountCircleIcon />, path: "/profile" },
];

export default function SideNav() {
  const navigate = useNavigate(); // 3. GET NAVIGATION FUNCTION
  const location = useLocation(); // 4. GET CURRENT LOCATION
  const pathname = location.pathname;

  // 5. DETERMINE SELECTED PATH (most specific first)
  const getSelectedPath = (p) => {
    if (p.startsWith("/profile")) return "/profile";
    if (p.startsWith("/ideas")) return "/ideas";
    if (p.startsWith("/market/create")) return "/market/create";
    if (p.startsWith("/search")) return "/search";
    if (p.startsWith("/market")) return "/market";
    return "/market";
  };
  
  const selectedPath = getSelectedPath(pathname);

  return (
    <Box sx={{ position: "sticky", top: 80, height: "calc(100vh - 100px)", p: 2 }}>
      <List>
        {/* 6. MAP OVER ITEMS TO CREATE DYNAMIC BUTTONS */}
        {navItems.map((item) => (
          <ListItemButton
            key={item.text}
            selected={selectedPath === item.path} // Set selected based on path
            onClick={() => navigate(item.path)}     // Navigate on click
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}