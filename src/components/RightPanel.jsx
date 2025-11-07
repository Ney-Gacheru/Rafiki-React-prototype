import React from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";

export default function RightPanel() {
  const [tab, setTab] = React.useState(0);

  return (
    <Box sx={{ position: "sticky", top: 80, height: "calc(100vh - 100px)", p: 2, borderLeft: "1px solid #eee" }}>
      <Tabs value={tab} onChange={(e,v)=>setTab(v)} orientation="horizontal">
        <Tab label="Notifications" />
        <Tab label="Messages" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {tab === 0 && <Typography color="text.secondary">No notifications yet</Typography>}
        {tab === 1 && <Typography color="text.secondary">No messages yet</Typography>}
      </Box>
    </Box>
  );
}
