// src/components/CarouselSimple.jsx
import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

/* Minimal carousel */
export default function CarouselSimple({ images = [], isXs = false }) {
  const [idx, setIdx] = useState(0);
  const height = isXs ? 200 : 340;
  const prev = () => setIdx(i => Math.max(0, i - 1));
  const next = () => setIdx(i => Math.min(images.length - 1, i + 1));

  return (
    <Box sx={{ position: "relative", width: "100%", height, bgcolor: "#f0f0f0" }}>
      <Box component="img" src={images[idx]} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
      {images.length > 1 && (
        <>
          {idx > 0 && (
             <IconButton 
              onClick={prev} 
              sx={{ 
                position: "absolute", 
                left: 8, 
                top: "50%", 
                transform: "translateY(-50%)", 
                bgcolor: "rgba(0,0,0,0.4)", 
                color: "#fff",
                '&:hover': { bgcolor: "rgba(0,0,0,0.6)" }
              }}
              size="small"
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 16, ml: 0.5 }} />
            </IconButton>
          )}
         {idx < images.length - 1 && (
            <IconButton 
              onClick={next} 
              sx={{ 
                position: "absolute", 
                right: 8, 
                top: "50%", 
                transform: "translateY(-50%)", 
                bgcolor: "rgba(0,0,0,0.4)", 
                color: "#fff",
                '&:hover': { bgcolor: "rgba(0,0,0,0.6)" }
              }}
              size="small"
            >
              <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
            </IconButton>
         )}
          
          {/* Dots */}
          <Box sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: 8, display: "flex", gap: 1 }}>
            {images.map((_, i) => <Box key={i} sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: i === idx ? "primary.main" : "rgba(255,255,255,0.6)" }} />)}
          </Box>
        </>
      )}
    </Box>
  );
}