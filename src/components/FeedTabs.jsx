// src/components/FeedTabs.jsx
import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  IconButton,
  Divider,
  Chip,
  useTheme,
  useMediaQuery
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VerifiedIcon from "@mui/icons-material/Verified";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useData } from "../context/DataContext";

/**
 * Compact, responsive FeedTabs focused on posts.
 * - Tabs: For Sale | For You | Request (For You default)
 * - Compact typography for phones
 * - Single-image dominant layout; carousel for multiple images
 * - Follow badge on avatar; verified icon for vendors
 * - Interaction bar spaced and compact
 */

export default function FeedTabs({ posts: propPosts }) {
  const { posts: ctxPosts = [], updatePost = () => {}, follows = {}, toggleFollow = () => {} } = useData();
  const posts = propPosts || ctxPosts || [];

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const [tab, setTab] = useState("forYou");

  const filtered = useMemo(() => {
    if (tab === "sale") return posts.filter(p => p.type === "sell");
    if (tab === "request") return posts.filter(p => p.type === "request");
    return posts;
  }, [posts, tab]);

  const toggleLike = (post) => {
    const liked = post._liked || false;
    const count = post.likes || 0;
    updatePost(post.id, { likes: liked ? Math.max(0, count - 1) : count + 1, _liked: !liked });
  };

  const tagFor = (t) => {
    if (t === "sell") return { label: "For Sale", bg: "#fff4e6", color: "#d35400" };
    if (t === "request") return { label: "Request", bg: "#eaf4ff", color: "#1d4ed8" };
    return { label: "General", bg: "#fffaf0", color: "#9a5800" };
  };

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

        {filtered.map(post => {
          const isVendor = post.role === "vendor";
          const isStudent = post.role === "student";
          const isFollowing = follows && follows[post.user] === true;
          const imgs = Array.isArray(post.images) ? post.images : [];
          const tag = tagFor(post.type);

          return (
            <Box
              key={post.id}
              sx={{
                borderRadius: 2,
                boxShadow: "0 6px 20px rgba(14,14,14,0.04)",
                p: isXs ? 1.25 : 2,
                background: "#fff"
              }}
            >
              {/* Header */}
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <Box sx={{ width: 52, height: 52, borderRadius: "50%", overflow: "hidden", position: "relative", bgcolor: "#f3f3f3" }}>
                    {post.avatar ? (
                      <img src={post.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <AccountCircleIcon sx={{ fontSize: 44, color: "#cfcfcf" }} />
                    )}

                    {/* follow badge */}
                    {post.user && (
                      <Box component="button"
                        onClick={() => toggleFollow(post.user)}
                        sx={{
                          position: "absolute",
                          right: -6,
                          bottom: -6,
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          border: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          color: "#fff",
                          background: isFollowing ? "primary.main" : "secondary.main",
                          cursor: "pointer",
                          boxShadow: "0 6px 18px rgba(0,0,0,0.12)"
                        }}
                        aria-label="follow"
                      >
                        {isFollowing ? "✓" : "+"}
                      </Box>
                    )}
                  </Box>
                </Grid>

                <Grid item xs>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: isXs ? 13 : 15 }}>
                      {post.user}
                    </Typography>
                    {isVendor && <VerifiedIcon sx={{ fontSize: 16, color: "primary.main" }} />}
                    <Chip label={tag.label} size="small"
                      sx={{ ml: 0.5, bgcolor: tag.bg, color: tag.color, fontWeight: 700, height: 26, fontSize: 11 }} />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: isXs ? 11 : 12 }}>
                    {new Date(post.createdAt || "").toLocaleDateString()}
                  </Typography>
                </Grid>

                <Grid item>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => {
                      if (post.type === "general" && isStudent) window.alert("Scout Talent (placeholder)");
                      else window.alert("View Deal (placeholder)");
                    }}
                    sx={{ textTransform: "none", fontSize: isXs ? 12 : 13 }}
                  >
                    {(post.type === "general" && isStudent) ? "Scout Talent" : (["sell","request"].includes(post.type) ? "View Deal" : "View Profile")}
                  </Button>
                </Grid>
              </Grid>

              {/* Body text */}
              <Typography sx={{ mt: 0.75, mb: 0.75, fontSize: isXs ? 13 : 14, lineHeight: 1.35 }}>
                {post.text}
              </Typography>

              {/* Image area */}
              {imgs.length > 0 && (
                <Box sx={{ borderRadius: 1, overflow: "hidden", mb: 1 }}>
                  {imgs.length === 1 ? (
                    <Box component="img"
                      src={imgs[0]}
                      alt=""
                      sx={{
                        width: "100%",
                        height: isXs ? 200 : 340,
                        objectFit: "cover",
                        borderRadius: 1
                      }}
                    />
                  ) : (
                    <CarouselSimple images={imgs} isXs={isXs} />
                  )}
                </Box>
              )}

              {/* Price */}
              {post.price && (
                <Typography sx={{ fontWeight: 800, mt: 0.5, fontSize: isXs ? 13 : 15 }}>
                  {post.price}
                </Typography>
              )}

              <Divider sx={{ my: 1 }} />

              {/* Interaction row */}
              <Grid container alignItems="center">
                <Grid item xs>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
                    <IconButton size={isXs ? "small" : "medium"} onClick={() => toggleLike(post)} aria-label="like">
                      {post._liked ? <FavoriteIcon color="error" fontSize={isXs ? "small" : "medium"} /> : <FavoriteBorderIcon fontSize={isXs ? "small" : "medium"} />}
                    </IconButton>
                    <Typography variant="body2" sx={{ minWidth: 28, fontSize: isXs ? 12 : 13 }}>{post.likes || 0}</Typography>

                    <IconButton size={isXs ? "small" : "medium"} onClick={() => window.alert("Comments (placeholder)")} aria-label="comments">
                      <ChatBubbleOutlineIcon fontSize={isXs ? "small" : "medium"} />
                    </IconButton>
                    <Typography variant="body2" sx={{ minWidth: 28, fontSize: isXs ? 12 : 13 }}>{post.comments || 0}</Typography>

                    {post.type === "sell" && <Button size="small" onClick={() => window.alert("Make Offer (placeholder)")} sx={{ textTransform: "none", ml: 0.5, fontSize: isXs ? 12 : 13 }}>Make Offer</Button>}
                    {post.type === "request" && <Button size="small" onClick={() => window.alert("Respond (placeholder)")} sx={{ textTransform: "none", ml: 0.5, fontSize: isXs ? 12 : 13 }}>Respond</Button>}
                  </Stack>
                </Grid>

                <Grid item>
                  <IconButton size={isXs ? "small" : "medium"} onClick={() => window.alert("Share (placeholder)")} aria-label="share">
                    <ShareIcon fontSize={isXs ? "small" : "medium"} />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}

/* Minimal carousel */
function CarouselSimple({ images = [], isXs = false }) {
  const [idx, setIdx] = useState(0);
  const height = isXs ? 200 : 320;
  const prev = () => setIdx(i => Math.max(0, i - 1));
  const next = () => setIdx(i => Math.min(images.length - 1, i + 1));

  return (
    <Box sx={{ position: "relative", width: "100%", height, bgcolor: "#000" }}>
      <Box component="img" src={images[idx]} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
      {images.length > 1 && (
        <>
          <IconButton onClick={prev} sx={{ position: "absolute", left: 6, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(0,0,0,0.36)", color: "#fff" }}>{'<'} </IconButton>
          <IconButton onClick={next} sx={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(0,0,0,0.36)", color: "#fff" }}>{'>'}</IconButton>
          <Box sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: 8, display: "flex", gap: 1 }}>
            {images.map((_, i) => <Box key={i} sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: i === idx ? "primary.main" : "rgba(255,255,255,0.6)" }} />)}
          </Box>
        </>
      )}
    </Box>
  );
}
