// src/pages/market/MarketHome.jsx
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import NavBar from "../../components/NavBar.jsx";
import SideNav from "../../components/SideNav.jsx";
import RightPanel from "../../components/RightPanel.jsx";
import BottomTab from "../../components/BottomTab.jsx";
import CreatePost from "./CreatePost.jsx";
import Profile from "../Profile.jsx";
import StudentCourses from "../lms/StudentCourses.jsx";
import EducatorClassroom from "../lms/EducatorClassroom.jsx";
import SchoolDashboard from "../lms/SchoolDashboard.jsx";
import Search from "../Search.jsx";
import Ideas from "../Ideas.jsx";
import Messages from "../Messages.jsx";
import Notifications from "../Notifications.jsx";

import MarketFeedTabs from "../../components/MarketFeedTabs.jsx";
import StudentFeedTabs from "../../components/StudentFeedTabs.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const studentRoles = ["student"];

// This is the main "Feed" page component
const MainFeed = () => {
  const { currentUser } = useAuth();
  const isStudent = currentUser && studentRoles.includes(currentUser.role);
  const CENTER_W = 760; // Keep consistent with layout

  return (
    <Box sx={{ maxWidth: { xs: "100%", lg: `${CENTER_W}px` }, mx: "auto", px: { xs: 1.5, md: 0 }, py: 1 }}>
      {isStudent ? <StudentFeedTabs /> : <MarketFeedTabs />}
    </Box>
  );
};


export default function MarketHome() {
  const [showBottom, setShowBottom] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(max-width:1023px)");
    const set = () => setShowBottom(m.matches);
    set();
    m.addEventListener("change", set);
    return () => m.removeEventListener("change", set);
  }, []);

  // widths used on large screens
  const SIDE_W = 260;
  const CENTER_W = 760;
  const RIGHT_W = 320;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        overflowX: "hidden",
      }}
    >
      <NavBar />

      <Box
        component="main"
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: { xs: 1.5, md: 3 },
          px: { xs: 1, sm: 2 },
          py: 2,
          boxSizing: "border-box",
        }}
      >
        {/* Side nav (desktop only) */}
        <Box
          sx={{
            display: { xs: "none", lg: "block" },
            width: SIDE_W,
            flex: { xs: "0 0 auto", lg: `0 0 ${SIDE_W}px` },
            minWidth: { lg: `${SIDE_W}px` },
            boxSizing: "border-box",
          }}
        >
          <SideNav />
        </Box>

        {/* Center feed (This is the router outlet) */}
        <Box
          sx={{
            width: { xs: "100%", lg: `${CENTER_W}px` },
            flex: { xs: "1 1 auto", lg: `0 0 ${CENTER_W}px` },
            minWidth: 0,
            height: { xs: `calc(100vh - 64px)`, sm: `calc(100vh - 64px)` },
            overflowY: "auto",
            overflowX: "hidden",
            px: { xs: 0, md: 0 },
            boxSizing: "border-box",
          }}
        >
          <Routes>
            {/* Market routes */}
            <Route path="market" element={<MainFeed />} />
            <Route path="market/create" element={<CreatePost />} />
            
            {/* Shared routes */}
            <Route path="search" element={<Search />} />
            <Route path="profile/:userId" element={<Profile />} />
            <Route path="messages" element={<Messages />} />
            <Route path="notifications" element={<Notifications />} />
            
            {/* Public/Market Ideas Page */}
            <Route path="ideas" element={<Ideas />} />

            {/* LMS Routes */}
            <Route path="courses" element={<StudentCourses />} />
            <Route path="classroom" element={<EducatorClassroom />} />
            <Route path="school-dashboard" element={<SchoolDashboard />} />

            {/* Default route */}
            <Route path="*" element={<MainFeed />} />
          </Routes>
        </Box>

        {/* Right panel (desktop only) */}
        <Box
          sx={{
            display: { xs: "none", lg: "block" },
            width: RIGHT_W,
            flex: { xs: "0 0 auto", lg: `0 0 ${RIGHT_W}px` },
            minWidth: { lg: `${RIGHT_W}px` },
            boxSizing: "border-box",
          }}
        >
          <RightPanel />
        </Box>
      </Box>

      {/* bottom tab on mobile */}
      {showBottom && <BottomTab />}
    </Box>
  );
}