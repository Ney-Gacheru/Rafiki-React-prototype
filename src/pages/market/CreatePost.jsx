// src/pages/market/CreatePost.jsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Stack,
  Typography,
  Grid,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  InputAdornment,
  Alert,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext"; // FIX: Removed .jsx extension
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import PublicIcon from "@mui/icons-material/Public";
import PeopleIcon from "@mui/icons-material/People";
import LockIcon from "@mui/icons-material/Lock";
import SellIcon from "@mui/icons-material/Sell";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";

function CreatePostContent() {
  const { createPost } = useData();
  const navigate = useNavigate();
  
  // 'general', 'sell', 'request'
  const [postMode, setPostMode] = useState("general"); 
  const [text, setText] = useState("");
  const [images, setImages] = useState([]); // Store placeholder image URLs
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [budget, setBudget] = useState("");
  const [visibility, setVisibility] = useState("everyone");
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState("");

  // Simulates adding a new image up to 10
  const addImage = () => {
    if (images.length >= 10) return;
    const placeholder = `https://placehold.co/400x400/f0f0f0/999?text=Image+${images.length + 1}`;
    setImages([...images, placeholder]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setError("");
    if (!text && !itemName) {
      setError("Please add some text or an item name.");
      return;
    }
    
    // Validate required fields for structured posts
    if (postMode === 'sell' && (!itemName || !price)) {
      setError("Product name and Price are required for a sale.");
      return;
    }
    if (postMode === 'request' && (!itemName || !budget)) {
      setError("Item name and Budget are required for a request.");
      return;
    }

    setIsPosting(true);
    try {
      await createPost({
        type: postMode, // 'general', 'sell', or 'request'
        text,
        images,
        itemName: (postMode === 'sell' || postMode === 'request') ? itemName : "",
        price: postMode === 'sell' ? price : "",
        budget: postMode === 'request' ? budget : "",
        visibility,
      });
      setIsPosting(false);
      navigate("/market"); // Go back to market feed
    } catch (err) {
      setError(err.message || "Failed to create post.");
      setIsPosting(false);
    }
  };

  const getButtonText = () => {
    if (postMode === 'sell') return "Post Sale";
    if (postMode === 'request') return "Post Request";
    return "Post";
  };
  
  const resetMode = () => {
    setPostMode('general');
    setItemName('');
    setPrice('');
    setBudget('');
    setError('');
  }

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2.5, border: "1px solid #eee" }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Create a post
        </Typography>

        <Stack spacing={2}>
          {/* Main text area */}
          <TextField
            label="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            multiline
            rows={5}
            fullWidth
            placeholder="Share your thoughts, project updates, or item details..."
          />
          
          {/* Image Uploader */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Images (max 10)</Typography>
            <Grid container spacing={1}>
              {images.map((img, i) => (
                <Grid item xs={4} sm={3} key={i}>
                  <Box sx={{ position: 'relative', aspectRatio: '1 / 1' }}>
                    <img src={img} alt="upload preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                    <IconButton
                      size="small"
                      onClick={() => removeImage(i)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        bgcolor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
              {images.length < 10 && (
                <Grid item xs={4} sm={3}>
                  <Button
                    onClick={addImage}
                    variant="outlined"
                    sx={{
                      aspectRatio: '1 / 1',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderColor: '#ddd',
                      color: '#777'
                    }}
                  >
                    <AddPhotoAlternateIcon />
                    <Typography variant="caption" sx={{ mt: 0.5 }}>Add</Typography>
                  </Button>
                </Grid>
              )}
            </Grid>
          </Box>
          
          {/* --- INTENTIONAL POSTING --- */}
          {postMode === 'general' && (
            <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
              <Button 
                onClick={() => setPostMode('sell')} 
                variant="outlined" 
                startIcon={<SellIcon />}
                sx={{ textTransform: 'none', borderRadius: 1.5 }}
              >
                Sell a Product
              </Button>
              <Button 
                onClick={() => setPostMode('request')} 
                variant="outlined" 
                startIcon={<RequestQuoteIcon />}
                sx={{ textTransform: 'none', borderRadius: 1.5 }}
              >
                Request a Product
              </Button>
            </Stack>
          )}
          
          {/* --- SELL FIELDS --- */}
          {postMode === 'sell' && (
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: '#ff7a00' }}>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ fontWeight: 600, color: '#d35400' }}><SellIcon sx={{verticalAlign: 'middle', mb: 0.5}}/> Selling a Product</Typography>
                  <IconButton size="small" onClick={resetMode}><CloseIcon fontSize="small" /></IconButton>
                </Stack>
                <TextField label="Product Name" value={itemName} onChange={(e) => setItemName(e.target.value)} required fullWidth />
                <TextField
                  label="Price (KSh)"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: <InputAdornment position="start">KSh</InputAdornment>,
                  }}
                />
              </Stack>
            </Paper>
          )}
          
          {/* --- REQUEST FIELDS --- */}
          {postMode === 'request' && (
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: '#1d4ed8' }}>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ fontWeight: 600, color: '#1d4ed8' }}><RequestQuoteIcon sx={{verticalAlign: 'middle', mb: 0.5}}/> Requesting a Product</Typography>
                  <IconButton size="small" onClick={resetMode}><CloseIcon fontSize="small" /></IconButton>
                </Stack>
                <TextField label="Item you are looking for" value={itemName} onChange={(e) => setItemName(e.target.value)} required fullWidth />
                <TextField
                  label="Your Budget (KSh)"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: <InputAdornment position="start">KSh</InputAdornment>,
                  }}
                />
              </Stack>
            </Paper>
          )}

          {/* Visibility */}
          <FormControl sx={{ pt: 1 }}>
            <FormLabel sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Visibility</FormLabel>
            <RadioGroup row value={visibility} onChange={(e) => setVisibility(e.target.value)}>
              <FormControlLabel value="everyone" control={<Radio />} label={ <Stack direction="row" alignItems="center" spacing={0.5}><PublicIcon sx={{fontSize: 18}} /><span>Everyone</span></Stack> } />
              <FormControlLabel value="followers" control={<Radio />} label={ <Stack direction="row" alignItems="center" spacing={0.5}><PeopleIcon sx={{fontSize: 18}} /><span>Followers</span></Stack> } />
              <FormControlLabel value="onlyMe" control={<Radio />} label={ <Stack direction="row" alignItems="center" spacing={0.5}><LockIcon sx={{fontSize: 18}} /><span>Only Me</span></Stack> } />
            </RadioGroup>
          </FormControl>

          {error && <Alert severity="error">{error}</Alert>}

          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={isPosting}
            sx={{ textTransform: 'none', fontWeight: 700, fontSize: 16 }}
          >
            {isPosting ? "Posting..." : getButtonText()}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

// This is the actual page component.
export default function CreatePostPage() {
  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: `calc(100vh - 64px)`, sm: `calc(100vh - 64px)` },
        overflowY: "auto",
        overflowX: "hidden",
        boxSizing: "border-box",
        bgcolor: "#f7f7f8" // Match the feed background
      }}
    >
      <CreatePostContent />
    </Box>
  );
}