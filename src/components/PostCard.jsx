// src/components/PostCard.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  IconButton,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import VerifiedIcon from "@mui/icons-material/Verified";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
// FIX: Removed .jsx extension from imports
import { useData } from "../context/DataContext";
import CarouselSimple from "./CarouselSimple"; // Extracted carousel

// Helper for post type tags
const tagFor = (t) => {
  if (t === "sell") return { label: "For Sale", bg: "#fff4e6", color: "#d35400" };
  if (t === "request") return { label: "Request", bg: "#eaf4ff", color: "#1d4ed8" };
  return { label: "General", bg: "#f3f4f6", color: "#4b5563" };
};

export default function PostCard({ post }) {
  const { updatePost, follows = {}, toggleFollow } = useData();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);

  const toggleLike = () => {
    const liked = post._liked || false;
    const count = post.likes || 0;
    updatePost(post.id, { likes: liked ? Math.max(0, count - 1) : count + 1, _liked: !liked });
  };

  const isVendor = post.role === "vendor";
  const isStudent = post.role === "student";
  const isFollowing = follows && post.userId && follows[post.userId] === true; // Use userId
  const imgs = Array.isArray(post.images) ? post.images : [];
  const tag = tagFor(post.type);

  const handleViewProfile = () => {
    setProfileOpen(false);
    // We'll need to create this page next
    navigate(`/profile/${post.userId}`); 
  };

  return (
    <>
      <Box
        sx={{
          borderRadius: 2.5,
          boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
          p: isXs ? 1.5 : 2,
          background: "#fff"
        }}
      >
        {/* Header: Avatar, Name, Follow, View Deal Button */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
          {/* Left side: Avatar + Name/Info */}
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0, flex: 1 }}>
            <IconButton onClick={() => setProfileOpen(true)} sx={{ p: 0 }}>
              <Avatar
                src={post.userAvatar || ""}
                alt={post.user}
                sx={{ width: 48, height: 48, bgcolor: "primary.main" }}
              >
                {post.user?.charAt(0)}
              </Avatar>
            </IconButton>

            <Box sx={{ minWidth: 0 }}>
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexWrap: "wrap" }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ fontWeight: 700, fontSize: isXs ? 14 : 15, cursor: "pointer" }} 
                  onClick={() => setProfileOpen(true)}
                  noWrap
                >
                  {post.user}
                </Typography>
                {isVendor && <VerifiedIcon sx={{ fontSize: 16, color: "primary.main" }} />}
                <Chip label={tag.label} size="small" sx={{ ml: 0.5, bgcolor: tag.bg, color: tag.color, fontWeight: 700, height: 22, fontSize: 10 }} />
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: isXs ? 11 : 12 }}>
                {new Date(post.createdAt || "").toLocaleDateString()}
              </Typography>
            </Box>
          </Stack>
          
          {/* Right side: Follow/View Deal Button */}
          <Box sx={{ flexShrink: 0, ml: 1 }}>
            {(post.type === "general" && isStudent) ? (
              <Button size="small" variant="outlined" onClick={() => console.log("Scout Talent (placeholder)")} sx={{ textTransform: "none", fontSize: isXs ? 12 : 13, borderRadius: 1.5 }}>
                Scout Talent
              </Button>
            ) : (["sell","request"].includes(post.type)) ? (
              <Button size="small" variant="contained" onClick={() => console.log("View Deal (placeholder)")} sx={{ textTransform: "none", fontSize: isXs ? 12 : 13, borderRadius: 1.5, boxShadow: "none" }}>
                View Deal
              </Button>
            ) : (
              // Follow button for "General" posts by non-students
              <Button
                size="small"
                variant={isFollowing ? "text" : "contained"}
                startIcon={isFollowing ? <CheckIcon /> : <AddIcon />}
                onClick={() => post.userId && toggleFollow(post.userId)}
                disabled={!post.userId}
                sx={{ textTransform: "none", fontSize: isXs ? 12 : 13, borderRadius: 1.5, boxShadow: "none", minWidth: 90 }}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </Box>
        </Stack>

        {/* Body text */}
        <Typography sx={{ mt: 1.5, mb: 1, fontSize: isXs ? 14 : 15, lineHeight: 1.45, color: "#333", whiteSpace: 'pre-wrap' }}>
          {post.text}
        </Typography>

        {/* Price */}
        {post.price && (
          <Typography sx={{ fontWeight: 800, mt: 0.5, fontSize: isXs ? 14 : 16, color: "primary.main" }}>
            {post.price}
          </Typography>
        )}

        {/* Image area */}
        {imgs.length > 0 && (
          <Box sx={{ borderRadius: 2, overflow: "hidden", my: 1.5 }}>
            <CarouselSimple images={imgs} isXs={isXs} />
          </Box>
        )}

        <Divider sx={{ my: 1 }} />

        {/* Interaction row */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          
          {/* Left Actions: Like, Comment */}
          <Stack direction="row" spacing={isXs ? 0.5 : 1} alignItems="center">
            <IconButton size={isXs ? "small" : "medium"} onClick={toggleLike} aria-label="like">
              {post._liked ? <FavoriteIcon color="error" fontSize="inherit" /> : <FavoriteBorderIcon fontSize="inherit" />}
            </IconButton>
            <Typography variant="body2" sx={{ minWidth: 28, fontSize: isXs ? 12 : 13, color: "text.secondary", fontWeight: 600 }}>{post.likes || 0}</Typography>

            <IconButton size={isXs ? "small" : "medium"} onClick={() => console.log("Comments (placeholder)")} aria-label="comments">
              <ChatBubbleOutlineIcon fontSize="inherit" />
            </IconButton>
            <Typography variant="body2" sx={{ minWidth: 28, fontSize: isXs ? 12 : 13, color: "text.secondary", fontWeight: 600 }}>{post.comments || 0}</Typography>
          </Stack>
          
          {/* Center Actions: Make Offer / Respond */}
          <Box>
            {post.type === "sell" && <Button size="small" onClick={() => console.log("Make Offer (placeholder)")} sx={{ textTransform: "none", fontSize: isXs ? 12 : 13, fontWeight: 600 }}>Make Offer</Button>}
            {post.type === "request" && <Button size="small" onClick={() => console.log("Respond (placeholder)")} sx={{ textTransform: "none", fontSize: isXs ? 12 : 13, fontWeight: 600 }}>Respond</Button>}
          </Box>
          
          {/* Right Action: Share */}
          <Box>
            <IconButton size={isXs ? "small" : "medium"} onClick={() => console.log("Share (placeholder)")} aria-label="share">
              <ShareIcon fontSize="inherit" />
            </IconButton>
          </Box>

        </Stack>
      </Box>

      {/* Profile Modal */}
      <Dialog open={profileOpen} onClose={() => setProfileOpen(false)}>
        <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
          <Avatar
            src={post.userAvatar || ""}
            alt={post.user}
            sx={{ width: 80, height: 80, mb: 1, mx: 'auto', fontSize: 40 }}
          >
            {post.user?.charAt(0)}
          </Avatar>
          {post.user}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            {post.role === 'vendor' && "Vetted Vendor"}
            {post.role === 'student' && "CodeCraft Student"}
            {post.role === 'customer' && "Rafiki Member"}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
          <Button onClick={() => setProfileOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleViewProfile}>View Profile</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}