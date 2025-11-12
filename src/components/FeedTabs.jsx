// src/components/FeedTabs.jsx
import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  useTheme,
  useMediaQuery
} from "@mui/material";
// Fixed import path
import { useData } from "../context/DataContext.jsx";
// Fixed import path
import PostCard from "./PostCard.jsx"; // 1. WE IMPORT THE NEW COMPONENT

export default function FeedTabs({ posts: propPosts }) {
  const { posts: ctxPosts = [] } = useData();
  const posts = propPosts || ctxPosts || [];

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const [tab, setTab] = useState("forYou");

  const filtered = useMemo(() => {
    if (tab === "sale") return posts.filter(p => p.type === "sell");
    if (tab ==="request") return posts.filter(p => p.type === "request");
    return posts;
  }, [posts, tab]);


  return (
    <Box>
      {/* Sticky tab row centered (compact) */}
      <Box sx={{ position: "sticky", top: 0, zIndex: 40, py: 1, bgcolor: "transparent" }}>
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

      <Stack spacing={1.25} sx={{ mt: 1 }}>
        {filtered.length === 0 && (
          <Typography color="text.secondary" sx={{ textAlign: "center", py: 6, fontSize: isXs ? 13 : 15 }}>
            No posts yet.
          </Typography>
        )}

        {/* 2. THE RENDER LOGIC IS NOW MUCH CLEANER */}
        {filtered.map(post => (
          <PostCard 
            key={post.id} 
            post={post} 
            isXs={isXs} 
          />
        ))}

      </Stack>
    </Box>
  );
}