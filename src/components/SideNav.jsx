import React from "react";
import { Box, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function SideNav() {
  return (
    <Box sx={{ position: "sticky", top: 80, height: "calc(100vh - 100px)", p: 2 }}>
      <List>
        <ListItemButton selected>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon><SearchIcon /></ListItemIcon>
          <ListItemText primary="Search" />
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
          <ListItemText primary="Post" />
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon><LightbulbIcon /></ListItemIcon>
          <ListItemText primary="Ideas" />
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon><AccountCircleIcon /></ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>
      </List>
    </Box>
  );
}
