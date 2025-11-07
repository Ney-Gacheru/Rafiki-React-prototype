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
  Chip
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useData } from "../context/DataContext";

/**
 * Styled FeedTabs with:
 * - clear tab line
 * - visually prominent single image and swipeable carousel for multiples
 * - follow button bottom-right of avatar
 * - well spaced like/comment/respond/share controls under the card
 * - keeps existing behavior (toggleLike, toggleFollow, updatePost etc.)
 */

export default function FeedTabs({ posts: propPosts }) {
  const { posts: ctxPosts, updatePost, follows, toggleFollow } = useData();
  const posts = propPosts || ctxPosts || [];

  const [tab, setTab] = useState("forYou"); // forYou / sale / request

  const filtered = useMemo(() => {
    if (tab === "sale") return posts.filter(p => p.type === "sell");
    if (tab === "request") return posts.filter(p => p.type === "request");
    return posts;
  }, [posts, tab]);

  const toggleLike = (post) => {
    const liked = post._liked || false;
    const count = post.likes || 0;
    const patch = { likes: liked ? Math.max(0, count - 1) : count + 1, _liked: !liked };
    updatePost(post.id, patch);
  };

  return (
    <Box>
      {/* Tabs line (lean, line-style) */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Button
          color={tab === "forYou" ? "primary" : "inherit"}
          variant={tab === "forYou" ? "contained" : "text"}
          onClick={() => setTab("forYou")}
          sx={{ textTransform: "none", px: 3, borderRadius: 2 }}
        >
          For You
        </Button>

        <Button
          color={tab === "sale" ? "primary" : "inherit"}
          variant={tab === "sale" ? "contained" : "text"}
          onClick={() => setTab("sale")}
          sx={{ textTransform: "none", px: 3, borderRadius: 2 }}
        >
          For Sale
        </Button>

        <Button
          color={tab === "request" ? "primary" : "inherit"}
          variant={tab === "request" ? "contained" : "text"}
          onClick={() => setTab("request")}
          sx={{ textTransform: "none", px: 3, borderRadius: 2 }}
        >
          Request
        </Button>

        <Box sx={{ flex: 1 }} />

        {/* small helper / divider */}
        <Divider orientation="vertical" flexItem sx={{ mx: 1, opacity: 0.2 }} />
        <Chip label={filtered.length + " posts"} size="small" />
      </Stack>

      {/* Feed */}
      <Stack spacing={2}>
        {filtered.length === 0 && (
          <Typography color="text.secondary" sx={{ textAlign: "center", py: 6 }}>No posts yet.</Typography>
        )}

        {filtered.map(post => {
          const isVendor = post.role === "vendor";
          const isStudent = post.role === "student";
          const isFollowing = (follows && follows[post.user]) === true;

          const imgs = Array.isArray(post.images) ? post.images : [];

          return (
            <Box
              key={post.id}
              sx={{
                borderRadius: 2,
                boxShadow: "0 8px 32px rgba(14,14,14,0.04)",
                p: 2,
                background: "#fff",
              }}
            >
              {/* header */}
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <Box sx={{ width: 56, height: 56, borderRadius: "50%", overflow: "hidden", position: "relative", bgcolor: "#f2f2f2" }}>
                    {post.avatar
                      ? <img src={post.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <AccountCircleIcon sx={{ fontSize: 48, color: "#cfcfcf" }} />
                    }

                    {/* follow/following floating button at bottom-right */}
                    {post.user && (
                      <Box
                        component="button"
                        onClick={() => toggleFollow(post.user)}
                        aria-label="follow"
                        sx={{
                          position: "absolute",
                          right: -6,
                          bottom: -6,
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          border: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          color: "#fff",
                          background: isFollowing ? "primary.main" : "secondary.main",
                          cursor: "pointer",
                          boxShadow: "0 6px 18px rgba(0,0,0,0.12)"
                        }}
                      >
                        {isFollowing ? "✓" : "+"}
                      </Box>
                    )}
                  </Box>
                </Grid>

                <Grid item xs>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {post.user} {isVendor && <VerifiedIcon sx={{ fontSize: 18, color: "primary.main", ml: 0.6 }} />}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">{new Date(post.createdAt || "").toLocaleDateString()}</Typography>
                </Grid>

                <Grid item>
                  <Button
                    variant="text"
                    onClick={() => {
                      if (post.type === "general" && isStudent) {
                        window.alert("Scout Talent -> open profile (placeholder)");
                      } else {
                        window.alert("View Deal (placeholder)");
                      }
                    }}
                    sx={{ textTransform: "none" }}
                  >
                    {(post.type === "general" && isStudent) ? "Scout Talent" : (["sell","request"].includes(post.type) ? "View Deal" : "View Profile")}
                  </Button>
                </Grid>
              </Grid>

              {/* text */}
              <Typography sx={{ mt: 1, mb: 1.25, lineHeight: 1.45 }}>{post.text}</Typography>

              {/* image area */}
              {imgs.length > 0 && (
                <Box sx={{ width: "100%", borderRadius: 1, overflow: "hidden", mb: 1.25 }}>
                  {imgs.length === 1 ? (
                    <Box
                      component="img"
                      src={imgs[0]}
                      alt=""
                      sx={{
                        width: "100%",
                        height: { xs: 260, sm: 340, md: 420 },
                        objectFit: "cover",
                        borderRadius: 1
                      }}
                    />
                  ) : (
                    <CarouselSimple images={imgs} />
                  )}
                </Box>
              )}

              {post.price && <Typography sx={{ fontWeight: 700, mt: 0.5, mb: 1 }}>{post.price}</Typography>}

              <Divider sx={{ my: 1 }} />

              {/* interaction row: left (like/comment/respond) spaced, right: share */}
              <Grid container alignItems="center">
                <Grid item xs>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    {/* Like with count */}
                    <IconButton onClick={() => toggleLike(post)} aria-label="like" size="large" sx={{ borderRadius: 1 }}>
                      {(post._liked) ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                    </IconButton>
                    <Typography variant="body2" sx={{ minWidth: 28 }}>{post.likes || 0}</Typography>

                    {/* Comment */}
                    <IconButton size="large" onClick={() => window.alert("Open comments (placeholder)")} aria-label="comment" sx={{ ml: 1 }}>
                      <ChatBubbleOutlineIcon />
                    </IconButton>
                    <Typography variant="body2" sx={{ minWidth: 28 }}>{post.comments || 0}</Typography>

                    {/* Offer / Respond / Placeholder */}
                    {post.type === "sell" && (
                      <Button size="small" sx={{ ml: 1, textTransform: "none" }} onClick={() => window.alert("Make Offer (placeholder)")}>Make Offer</Button>
                    )}
                    {post.type === "request" && (
                      <Button size="small" sx={{ ml: 1, textTransform: "none" }} onClick={() => window.alert("Respond (placeholder)")}>Respond</Button>
                    )}
                  </Stack>
                </Grid>

                <Grid item>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <IconButton size="large" onClick={() => window.alert("Share (placeholder)")} aria-label="share">
                      <ShareIcon />
                    </IconButton>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}

/** simple carousel component (no external dependency) */
function CarouselSimple({ images = [] }) {
  const [idx, setIdx] = useState(0);
  const next = () => setIdx(i => Math.min(images.length - 1, i + 1));
  const prev = () => setIdx(i => Math.max(0, i - 1));
  return (
    <Box sx={{ position: "relative", width: "100%", height: { xs: 260, sm: 340, md: 420 }, bgcolor: "#000" }}>
      <Box component="img" src={images[idx]} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
      {images.length > 1 && (
        <>
          <IconButton
            onClick={prev}
            sx={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(0,0,0,0.38)", color: "#fff" }}
            aria-label="previous"
            size="small"
          >
            ‹
          </IconButton>

          <IconButton
            onClick={next}
            sx={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(0,0,0,0.38)", color: "#fff" }}
            aria-label="next"
            size="small"
          >
            ›
          </IconButton>

          <Box sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: 10, display: "flex", gap: 1 }}>
            {images.map((_, i) => (
              <Box key={i} sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: i === idx ? "primary.main" : "rgba(255,255,255,0.6)" }} />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
