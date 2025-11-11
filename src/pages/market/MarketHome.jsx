// src/pages/market/MarketHome.jsx
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import NavBar from "../../components/NavBar";
import SideNav from "../../components/SideNav";
import RightPanel from "../../components/RightPanel";
import FeedTabs from "../../components/FeedTabs";
import BottomTab from "../../components/BottomTab";

/**
 * Responsive MarketHome:
 * - No horizontal scrolling
 * - side / center / right columns fixed on large screens
 * - center becomes full-width and flexible on small screens
 * - center feed has its own vertical scroll
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
        // ensure page itself doesn't scroll horizontally
        overflowX: "hidden",
      }}
    >
      <NavBar />

      {/* Main row: three columns. Center becomes flexible on small screens */}
      <Box
        component="main"
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: { xs: 1.5, md: 3 },
          px: { xs: 1, sm: 2 },
          py: 2,
          // keep overall container from forcing horizontal scroll
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

        {/* Center feed */}
        <Box
          sx={{
            // on large screens use fixed width, on small screens be fluid
            width: { xs: "100%", lg: `${CENTER_W}px` },
            flex: { xs: "1 1 auto", lg: `0 0 ${CENTER_W}px` },
            minWidth: 0, // important so children can shrink and avoid horizontal overflow
            // independent vertical scroll for the feed area
            height: { xs: `calc(100vh - 64px)`, sm: `calc(100vh - 64px)` },
            overflowY: "auto",
            overflowX: "hidden",
            // center content padding
            px: { xs: 0, md: 0 },
            boxSizing: "border-box",
          }}
        >
          <Box sx={{ maxWidth: { xs: "100%", lg: `${CENTER_W}px` }, mx: "auto", px: { xs: 1.5, md: 0 }, py: 1 }}>
            <FeedTabs />
          </Box>
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
