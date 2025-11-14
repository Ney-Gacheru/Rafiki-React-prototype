import React, { useMemo } from "react";
import { Box, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SchoolIcon from "@mui/icons-material/School"; // Student: Courses
import ClassroomIcon from "@mui/icons-material/SupervisorAccount"; // Educator: Classroom
import DashboardIcon from "@mui/icons-material/Dashboard"; // School: Dashboard
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx"; 

// Helper function to get the correct LMS/Ideas link based on role
const getLmsLink = (role) => {
  switch (role) {
    case "student":
      return { text: "Courses", icon: <SchoolIcon />, path: "/courses" };
    case "educator":
      return { text: "Classroom", icon: <ClassroomIcon />, path: "/classroom" };
    case "school":
      return { text: "Dashboard", icon: <DashboardIcon />, path: "/school-dashboard" };
    default:
      // vendor, customer
      return { text: "Ideas", icon: <LightbulbIcon />, path: "/ideas" };
  }
};

export default function SideNav() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  // Define navigation items based on role
  const navItems = useMemo(() => {
    const role = currentUser?.role;
    const lmsLink = getLmsLink(role); // Get the role-specific link
    
    const items = [
      { text: "Home", icon: <HomeIcon />, path: "/market" },
      { text: "Search", icon: <SearchIcon />, path: "/search" },
      { text: "Post", icon: <AddCircleOutlineIcon />, path: "/market/create" },
    ];
    
    items.push(lmsLink); // Add the correct link
    
    items.push({ 
      text: "Profile", 
      icon: <AccountCircleIcon />, 
      path: `/profile/${currentUser?.userId || 'me'}` 
    });
    return items;

  }, [currentUser]);


  const isSelected = (item) => {
    if (item.path === "/market") return pathname === "/market" || pathname === "/";
    return pathname.startsWith(item.path);
  };

  return (
    <Box sx={{ position: "sticky", top: 80, height: "calc(100vh - 100px)", p: 2 }}>
      <List>
        {navItems.map((item) => (
          <ListItemButton 
            key={item.text} 
            selected={isSelected(item)}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}