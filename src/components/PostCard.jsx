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
import PublicIcon from "@mui/icons-material/Public";
import PeopleIcon from "@mui/icons-material/People";
import LockIcon from "@mui/icons-material/Lock";
import SchoolIcon from '@mui/icons-material/School';
import GavelIcon from '@mui/icons-material/Gavel';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import { useNavigate } from "react-router-dom";
// FIX: Removed .jsx extensions
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import CarouselSimple from "./CarouselSimple";

// Helper for post type tags
const tagFor = (t) => {
  if (t === "sell") return { label: "For Sale", bg: "#fff4e6", color: "#d35400" };
  if (t === "request") return { label: "Request", bg: "#eaf4ff", color: "#1d4ed8" };
  return { label: "General", bg: "#f3f4f6", color: "#4b5563" };
};

// Helper for visibility icon
const VisibilityIcon = ({ visibility }) => {
  const sx = { fontSize: 12, color: "text.secondary", ml: 0.5 };
  if (visibility === 'followers') return <PeopleIcon sx={sx} />;
  if (visibility === 'onlyMe') return <LockIcon sx={sx} />;
  return <PublicIcon sx={sx} />; // Default 'everyone'
};

// Helper for Verification Badge
const VerificationBadge = ({ verification }) => {
  const sx = { fontSize: 16, color: "primary.main" };
  if (verification === 'vetted') return <GavelIcon sx={{ ...sx, color: "success.main" }} />;
  if (verification === 'verified_org') return <CorporateFareIcon sx={sx} />;
  if (verification === 'student') return <SchoolIcon sx={{ ...sx, color: "secondary.main" }} />;
  return null;
};

// Helper for Role Name
const RoleName = ({ role }) => {
  if (role === 'vendor') return "Vetted Vendor";
  if (role === 'educator') return "Educator";
  if (role === 'school') return "Verified School";
  if (role === 'student') return "CodeCraft Student";
  return "Rafiki Member";
};

export default function PostCard({ post }) {
  const { updatePost, follows = {}, toggleFollow } = useData();
  const { currentUser } = useAuth();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleLike = () => {
    const liked = post._liked || false;
    const count = post.likes || 0;
    updatePost(post.id, { likes: liked ? Math.max(0, count - 1) : count + 1, _liked: !liked });
  };

  const isFollowing = follows && post.userId && follows[post.userId] === true;
  const imgs = Array.isArray(post.images) ? post.images : [];
  const tag = tagFor(post.type);

  const handleViewProfile = () => {
    setProfileOpen(false);
    navigate(`/profile/${post.userId || post.user}`); 
  };
  
  // Renders the main action button based on post type
  const renderActionButton = () => {
    if (["sell","request"].includes(post.type)) {
      return (
        <Button 
          size="small" 
          variant="contained" 
          onClick={() => console.log("View Deal (placeholder)")} 
          sx={{ textTransform: "none", fontSize: isXs ? 12 : 13, borderRadius: 1.5, boxShadow: "none" }}
        >
          View Deal
        </Button>
      );
    }
    
    // Show Scout Talent on ALL general posts now
    if (post.type === "general") {
       // *** NEW LOGIC: Change button text based on user role ***
       const isStudentViewer = currentUser?.role === 'student';
       const buttonText = isStudentViewer ? "View Portfolio" : "Scout Talent";

       return (
        <Button 
          size="small" 
          variant="outlined" 
          onClick={handleViewProfile} // Go directly to profile
          sx={{ textTransform: "none", fontSize: isXs ? 12 : 13, borderRadius: 1.5 }}
        >
          {buttonText}
        </Button>
      );
    }
    
    return null;
  }

  // --- COMMENT LOGIC ---
  const lmsRoles = ['student', 'educator', 'school'];
  const isPostByLmsUser = lmsRoles.includes(post.role);
  
  let canComment = false;
  if (currentUser) {
    const isViewerLmsUser = lmsRoles.includes(currentUser.role);

    if (!isPostByLmsUser) {
      // Public post (by vendor/customer) - anyone logged in can comment
      canComment = true;
    } else {
      // Student/Educator/School post - only other LMS users can comment
      canComment = isViewerLmsUser;
    }
  }
  // --- END COMMENT LOGIC ---

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
                {/* This is where the badge is rendered */}
                <VerificationBadge verification={post.verification} />
                {/* Only show "For Sale" / "Request" tags */}
                {post.type !== 'general' && (
                  <Chip label={tag.label} size="small" sx={{ ml: 0.5, bgcolor: tag.bg, color: tag.color, fontWeight: 700, height: 22, fontSize: 10 }} />
                )}
              </Stack>
              
              <Stack direction="row" alignItems="center">
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: isXs ? 11 : 12 }}>
                  {new Date(post.createdAt || "").toLocaleDateString()}
                </Typography>
                <VisibilityIcon visibility={post.visibility} />
              </Stack>
            </Box>
          </Stack>
          
          {/* Right side: Action Button */}
          <Box sx={{ flexShrink: 0, ml: 1 }}>
            {renderActionButton()}
          </Box>
        </Stack>

        {/* Item Name (for Sell/Request) */}
        {post.itemName && (
          <Typography sx={{ mt: 1.5, fontWeight: 700, fontSize: isXs ? 15 : 17 }}>
            {post.itemName}
          </Typography>
        )}

        {/* Body text */}
        {post.text && (
          <Typography sx={{ mt: 0.5, mb: 1, fontSize: isXs ? 14 : 15, lineHeight: 1.45, color: "#333", whiteSpace: 'pre-wrap' }}>
            {post.text}
          </Typography>
        )}
        
        {/* Price / Budget */}
        {post.price && (
          <Typography sx={{ fontWeight: 800, mt: 0.5, fontSize: isXs ? 14 : 16, color: "primary.main" }}>
            Price: {post.price}
          </Typography>
        )}
        {post.budget && (
          <Typography sx={{ fontWeight: 700, mt: 0.5, fontSize: isXs ? 14 : 16, color: "text.secondary" }}>
            Budget: {post.budget}
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

            {canComment && (
              <>
                <IconButton size={isXs ? "small" : "medium"} onClick={() => console.log("Comments (placeholder)")} aria-label="comments">
                  <ChatBubbleOutlineIcon fontSize="inherit" />
                </IconButton>
                <Typography variant="body2" sx={{ minWidth: 28, fontSize: isXs ? 12 : 13, color: "text.secondary", fontWeight: 600 }}>{post.comments || 0}</Typography>
              </>
            )}
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
            <RoleName role={post.role} />
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