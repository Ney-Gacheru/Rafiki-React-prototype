// src/components/BottomTab.jsx
import React, { useMemo, useEffect } from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SchoolIcon from "@mui/icons-material/School";
import ClassroomIcon from "@mui/icons-material/SupervisorAccount";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx"; 

// Helper function to get the correct LMS/Ideas link based on role
const getLmsLink = (role) => {
  switch (role) {
    case "student":
      return { label: "Courses", icon: <SchoolIcon />, path: "/courses" };
    case "educator":
      return { label: "Classroom", icon: <ClassroomIcon />, path: "/classroom" };
    case "school":
      return { label: "Dashboard", icon: <DashboardIcon />, path: "/school-dashboard" };
    default:
      // vendor, customer
      return { label: "Ideas", icon: <LightbulbIcon />, path: "/ideas" };
  }
};

export default function BottomTab() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  // Define navigation items based on role
  const navItems = useMemo(() => {
    const role = currentUser?.role;
    const lmsLink = getLmsLink(role); // Get the role-specific link

    const items = [
      { label: "Home", icon: <HomeIcon />, path: "/market" },
      { label: "Search", icon: <SearchIcon />, path: "/search" },
      { label: "Post", icon: <AddCircleOutlineIcon />, path: "/market/create" },
    ];
    
    items.push(lmsLink); // Add the correct link
    
    items.push({ 
      label: "Profile", 
      icon: <AccountCircleIcon />, 
      path: `/profile/${currentUser?.userId || 'me'}` 
    });
    return items;
  }, [currentUser]);


  // Map current path to the index in navItems
  const mapPathToIndex = (p) => {
    // Check most specific first
    if (p.startsWith("/market/create")) return 2;
    if (p.startsWith("/courses") || p.startsWith("/classroom") || p.startsWith("/school-dashboard") || p.startsWith("/ideas")) return 3;
    if (p.startsWith("/profile")) return 4;
    if (p.startsWith("/search")) return 1;
    if (p.startsWith("/market") || p === "/") return 0; // Home is the fallback
    return 0;
  };

  const [value, setValue] = React.useState(mapPathToIndex(pathname));

  useEffect(() => {
    setValue(mapPathToIndex(pathname));
  }, [pathname]);


  const handleChange = (event, v) => {
    setValue(v);
    if (navItems[v]) {
      navigate(navItems[v].path);
    }
  };

  return (
    <Paper elevation={8} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1300 }}>
      <BottomNavigation showLabels value={value} onChange={handleChange}>
        {navItems.map((item) => (
          <BottomNavigationAction key={item.label} label={item.label} icon={item.icon} />
        ))}
      </BottomNavigation>
    </Paper>
  );
}