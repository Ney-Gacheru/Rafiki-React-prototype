// src/pages/lms/EducatorClassroom.jsx
import React from "react";
import { Box, Typography, Paper, List, ListItem, ListItemText, Avatar, Button } from "@mui/material";
// FIX: Removed .jsx extensions from imports
import { useData } from "../../context/DataContext";
import NavBar from "../../components/NavBar";

export default function EducatorClassroom() {
  const { getTasks, getArticles } = useData();
  const tasks = getTasks();
  const articles = getArticles();

  // In a real app, you'd filter these by the educator's ID
  const myStudents = [ 
    { name: "Lyn Student", avatar: "https://placehold.co/100x100/8e44ad/fff?text=L" },
    { name: "Demo Student 2", avatar: "https://placehold.co/100x100/3498db/fff?text=D" }
  ];

  return (
    <Box sx={{ bgcolor: "#f7f7f8", minHeight: "100vh" }}>
      <NavBar />
      <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, md: 3 } }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
          My Classroom
        </Typography>

        <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, mb: 3, boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>My Students</Typography>
          <List>
            {myStudents.map(student => (
              <ListItem key={student.name}>
                <Avatar src={student.avatar} sx={{ mr: 2 }} />
                <ListItemText primary={student.name} />
                <Button size="small">View Progress</Button>
              </ListItem>
            ))}
          </List>
        </Paper>

        <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, mb: 3, boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>My Tasks (Gallery Walks)</Typography>
          <List>
            {tasks.map(task => (
              <ListItem key={task.id}>
                <ListItemText primary={task.title} secondary={task.courseName} />
                <Button size="small">View Submissions</Button>
              </ListItem>
            ))}
          </List>
          <Button variant="contained" sx={{ mt: 2 }}>Create New Task</Button>
        </Paper>

        <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, mb: 3, boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>My Articles</Typography>
          <List>
            {articles.map(article => (
              <ListItem key={article.id}>
                <ListItemText primary={article.title} secondary={article.excerpt} />
              </ListItem>
            ))}
          </List>
          <Button variant="contained" sx={{ mt: 2 }}>Write New Article</Button>
        </Paper>
      </Box>
    </Box>
  );
}