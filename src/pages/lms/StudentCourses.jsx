// src/pages/lms/StudentCourses.jsx
import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { useData } from "../../context/DataContext.jsx";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function StudentCourses() {
  const { courses, studentProgress } = useData();
  const currentCourse = courses[0]; // Get the "Fundamentals" course
  const progress = studentProgress["c1"] || {}; // Get progress for that course

  const completedModules = Object.values(progress).filter(Boolean).length;
  const totalModules = currentCourse.modules.length;
  const progressPercent = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        My Roadmap
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {currentCourse.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {currentCourse.description}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Box sx={{ width: "10E%", mr: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progressPercent}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography variant="body2" color="text.secondary">{`${Math.round(
                progressPercent
              )}%`}</Typography>
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {completedModules} of {totalModules} modules completed
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        Modules
      </Typography>
      <List sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
        {currentCourse.modules.map((module, index) => {
          const isCompleted = progress[module.id];
          return (
            <React.Fragment key={module.id}>
              <ListItem>
                <ListItemIcon>
                  {isCompleted ? (
                    <CheckCircleIcon color="primary" />
                  ) : (
                    <AssignmentIcon color="action" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={module.title}
                  secondary={module.description}
                  sx={{
                    textDecoration: isCompleted ? "line-through" : "none",
                    color: isCompleted ? "text.secondary" : "text.primary",
                  }}
                />
              </ListItem>
              {index < currentCourse.modules.length - 1 && <Divider component="li" />}
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );
}