// src/components/MarketFeedTabs.jsx
// This is your previous FeedTabs.jsx, renamed.
import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { useData } from "../context/DataContext.jsx"; // FIX: Added .jsx
import PostCard from "./PostCard.jsx"; // FIX: Added .jsx

export default function MarketFeedTabs() {
  const { posts: ctxPosts = [] } = useData();
  const posts = ctxPosts || [];

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const [tab, setTab] = useState("forYou");

  const filtered = useMemo(() => {
    if (tab === "sale") return posts.filter(p => p.type === "sell");
    if (tab === "request") return posts.filter(p => p.type === "request");
    // "For You" for market users shows everything (social, sell, request)
    return posts;
  }, [posts, tab]);

  return (
    <Box>
      {/* Sticky tab row */}
      <Box sx={{ 
        position: "sticky", 
        top: 0, 
        zIndex: 40, 
        py: 1, 
        // FIX: Add background to prevent content showing through
        bgcolor: "#f7f7f8",
        backdropFilter: "blur(4px)",
        borderBottom: "1px solid #eee"
      }}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
          <Button
            variant={tab === "sale" ? "contained" : "text"}
            size={isXs ? "small" : "medium"}
            onClick={() => setTab("sale")}
            sx={{ textTransform: "none", px: 2, borderRadius: 2, fontSize: isXs ? 12 : 14 }}
          >
            For Sale
          </Button>
          <Button
            variant={tab === "forYou" ? "contained" : "text"}
            size={isXs ? "small" : "medium"}
            onClick={() => setTab("forYou")}
            sx={{ textTransform: "none", px: 3, borderRadius: 2, fontSize: isXs ? 12 : 14 }}
          >
            For You
          </Button>
          <Button
            variant={tab === "request" ? "contained" : "text"}
            size={isXs ? "small" : "medium"}
            onClick={() => setTab("request")}
            sx={{ textTransform: "none", px: 2, borderRadius: 2, fontSize: isXs ? 12 : 14 }}
          >
            Request
          </Button>
        </Stack>
      </Box>

      <Stack spacing={1.5} sx={{ mt: 1, pb: 8 }}>
        {filtered.length === 0 && (
          <Typography color="text.secondary" sx={{ textAlign: "center", py: 6, fontSize: isXs ? 13 : 15 }}>
            No posts yet.
          </Typography>
        )}

        {filtered.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </Stack>
    </Box>
  );
}