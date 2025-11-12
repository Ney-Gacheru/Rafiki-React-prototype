// src/components/BottomTab.jsx
import React from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate, useLocation } from "react-router-dom";

export default function BottomTab() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  // map current path to index
  const mapPathToIndex = (p) => {
    // 1. CHECK MOST SPECIFIC ROUTES FIRST
    if (p.startsWith("/profile")) return 4;
    if (p.startsWith("/ideas")) return 3;
    if (p.startsWith("/market/create")) return 2; // Was being missed
    if (p.startsWith("/search")) return 1;
    if (p.startsWith("/market")) return 0;
    return 0;
  };

  // We set state based on the fixed mapping function
  const [value, setValue] = React.useState(mapPathToIndex(pathname));

  // 2. We also update the component when the pathname changes
  React.useEffect(() => {
    setValue(mapPathToIndex(pathname));
  }, [pathname]);


  const handleChange = (event, v) => {
    // 3. We let the state be set by the useEffect,
    //    we just handle navigation.
    switch (v) {
      case 0: navigate("/market"); break;
      case 1: navigate("/search"); break;
      case 2: navigate("/market/create"); break;
      case 3: navigate("/ideas"); break;
      case 4: navigate("/profile"); break;
      default: navigate("/market");
    }
  };

  return (
    <Paper elevation={8}>
      <BottomNavigation showLabels value={value} onChange={handleChange}>
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Search" icon={<SearchIcon />} />
        <BottomNavigationAction label="Post" icon={<AddCircleOutlineIcon />} />
        <BottomNavigationAction label="Ideas" icon={<LightbulbIcon />} />
        <BottomNavigationAction label="Profile" icon={<AccountCircleIcon />} />
      </BottomNavigation>
    </Paper>
  );
}