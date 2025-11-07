// src/pages/market/MarketHome.jsx
import React, { useEffect, useRef, useState } from "react";
import { Box, Grid } from "@mui/material";
import NavBar from "../../components/NavBar";
import SideNav from "../../components/SideNav";
import RightPanel from "../../components/RightPanel";
import FeedTabs from "../../components/FeedTabs";
import BottomTab from "../../components/BottomTab";
import { useData } from "../../context/DataContext";
import { useTheme } from "@mui/material/styles";

export default function MarketHome() {
  const { getPosts } = useData();
  const posts = getPosts();
  const theme = useTheme();

  // show bottom tab on small screens only
  const [showBottom, setShowBottom] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(max-width:1023px)");
    const set = () => setShowBottom(m.matches);
    set();
    m.addEventListener?.("change", set);
    return () => m.removeEventListener?.("change", set);
  }, []);

  // hide / show navbar and bottom-tab on scroll
  const lastY = useRef(window.scrollY || 0);
  const rafRef = useRef(null);
  const [hideTop, setHideTop] = useState(false);
  const [hideBottomDuringScroll, setHideBottomDuringScroll] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const current = window.scrollY || 0;
        const delta = current - lastY.current;

        // threshold to avoid twitchiness
        if (delta > 10) {
          // scrolling down
          setHideTop(true);
          setHideBottomDuringScroll(true);
        } else if (delta < -10) {
          // scrolling up
          setHideTop(false);
          setHideBottomDuringScroll(false);
        }
        lastY.current = current;
        rafRef.current = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Styles for top & bottom hide/show
  const topWrapperSx = {
    position: "sticky",
    top: 0,
    zIndex: 600,
    transition: "transform 260ms ease, opacity 240ms ease",
    transform: hideTop ? "translateY(-120%)" : "translateY(0)",
    opacity: hideTop ? 0 : 1,
    background: "rgba(255,255,255,0.95)" // keep the translucent look if nav wants it
  };

  const bottomWrapperSx = {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 700,
    transition: "transform 260ms ease, opacity 240ms ease",
    transform: hideBottomDuringScroll ? "translateY(120%)" : "translateY(0)"
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      {/* Top Nav (wrapped so we can hide it smoothly) */}
      <Box sx={topWrapperSx}>
        <NavBar />
      </Box>

      <Grid container>
        {/* Side nav for desktop (left) */}
        <Grid item sx={{ display: { xs: "none", lg: "block" } }} lg={3}>
          <Box sx={{ height: "100%", py: 2 }}>
            <SideNav />
          </Box>
        </Grid>

        {/* Main feed (middle) */}
        <Grid item xs={12} lg={6}>
          <Box sx={{ maxWidth: 920, mx: "auto", px: { xs: 2, md: 3 }, py: 2 }}>
            {/* The tabs container - make the Tabs sticky so user can switch while scrolling.
                This wrapper is small and only keeps the tabs visible; FeedTabs should place the actual tab controls near the top of its output. */}
            <Box
              sx={{
                position: { xs: "relative", md: "sticky" },
                top: { md: 80 },
                zIndex: 300,
                // lighter visual: use a thin underline style (you asked for a line rather than box)
                borderBottom: `1px solid ${theme.palette.divider}`,
                background: { md: "transparent" }, // keep subtle
                mb: 2,
                pt: { md: 0.5 }
              }}
            >
              {/* pass posts down; FeedTabs can use them or ignore if it loads itself */}
              <FeedTabs posts={posts} />
            </Box>

            {/* Feed content (if FeedTabs itself does the rendering, this will be fine;
                otherwise FeedTabs can render the whole feed including individual post cards) */}
          </Box>
        </Grid>

        {/* Right panel (desktop) */}
        <Grid item sx={{ display: { xs: "none", lg: "block" } }} lg={3}>
          <Box sx={{ height: "100%", py: 2 }}>
            <RightPanel />
          </Box>
        </Grid>
      </Grid>

      {/* bottom tab on mobile (wrapped so we can hide during scroll) */}
      {showBottom && (
        <Box sx={bottomWrapperSx}>
          <BottomTab />
        </Box>
      )}
    </Box>
  );
}
