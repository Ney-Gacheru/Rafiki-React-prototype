// src/components/StudentFeedTabs.jsx
import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { useData } from "../context/DataContext.jsx";
import PostCard from "./PostCard.jsx";
import TaskPostCard from "./TaskPostCard.jsx"; // We'll need this

export default function StudentFeedTabs() {
  const { posts = [], tasks = [] } = useData();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const [tab, setTab] = useState("feed"); // Default to social feed

  // 1. "Feed" tab shows all general/social posts
  const feedPosts = useMemo(() => {
    return posts.filter(p => p.type === "general");
  }, [posts]);

  // 2. "Showcase" tab shows all tasks
  const showcaseTasks = useMemo(() => {
    return tasks;
  }, [tasks]);

  return (
    <Box>
      {/* Sticky tab row */}
      <Box sx={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        py: 1,
        bgcolor: "#f7f7f8", // Opaque background
        backdropFilter: "blur(4px)",
        borderBottom: "1px solid rgba(0,0,0,0.04)"
      }}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
          <Button
            variant={tab === "feed" ? "contained" : "text"}
            size={isXs ? "small" : "medium"}
            onClick={() => setTab("feed")}
            sx={{ textTransform: "none", px: 3, borderRadius: 2, fontSize: isXs ? 12 : 14 }}
          >
            Feed
          </Button>
          <Button
            variant={tab === "showcase" ? "contained" : "text"}
            size={isXs ? "small" : "medium"}
            onClick={() => setTab("showcase")}
            sx={{ textTransform: "none", px: 3, borderRadius: 2, fontSize: isXs ? 12 : 14 }}
          >
            Showcase
          </Button>
        </Stack>
      </Box>

      {/* Content based on tab */}
      <Stack spacing={1.5} sx={{ mt: 1.5 }}>
        {tab === 'feed' && (
          <>
            {feedPosts.length === 0 && (
              <Typography color="text.secondary" sx={{ textAlign: "center", py: 6, fontSize: isXs ? 13 : 15 }}>
                Your social feed is empty.
              </Typography>
            )}
            {feedPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </>
        )}

        {tab === 'showcase' && (
          <>
            {showcaseTasks.length === 0 && (
              <Typography color="text.secondary" sx={{ textAlign: "center", py: 6, fontSize: isXs ? 13 : 15 }}>
                No tasks or discussions yet.
              </Typography>
            )}
            {showcaseTasks.map(task => (
              <TaskPostCard key={task.id} task={task} />
            ))}
          </>
        )}
      </Stack>
    </Box>
  );
}