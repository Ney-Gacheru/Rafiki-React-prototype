// src/pages/market/MarketHome.jsx
import React, { useEffect, useState } from "react";
// 1. IMPORT Routes and Route
import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import NavBar from "../../components/NavBar.jsx";
import SideNav from "../../components/SideNav.jsx";
import RightPanel from "../../components/RightPanel.jsx";
import FeedTabs from "../../components/FeedTabs.jsx";
import BottomTab from "../../components/BottomTab.jsx";

// 2. IMPORT THE NEW CreatePost PAGE
import CreatePost from "./CreatePost.jsx";

/**
 * Responsive MarketHome:
 * - This component is now a LAYOUT + ROUTER OUTLET.
 * - It renders the 3-column layout.
 * - The center column renders *nested routes* (the feed or the create post page).
 */

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
        bgcolor: "#f7f7f8",
        overflowX: "hidden",
      }}
    >
      <NavBar />

      {/* Main row: three columns */}
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

        {/* Center feed - THIS IS NOW A ROUTER OUTLET */}
        <Box
          sx={{
            width: { xs: "100%", lg: `${CENTER_W}px` },
            flex: { xs: "1.0 1 auto", lg: `0 0 ${CENTER_W}px` },
            minWidth: 0, 
            height: { xs: `calc(100vh - 64px)`, sm: `calc(100vh - 64px)` },
            overflowY: "auto",
            overflowX: "hidden",
            px: { xs: 0, md: 0 },
            boxSizing: "border-box",
          }}
        >
          {/* 3. SET UP NESTED ROUTES */}
          <Routes>
            {/* /market/ maps to FeedTabs */}
            <Route index element={
              <Box sx={{ maxWidth: { xs: "100%", lg: `${CENTER_W}px` }, mx: "auto", px: { xs: 1.5, md: 0 }, py: 1 }}>
                <FeedTabs />
              </Box>
            } />
            
            {/* /market/create maps to CreatePost */}
            <Route path="create" element={<CreatePost />} />
            
            {/* TODO: Add other nested routes like /market/post/:id */}
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