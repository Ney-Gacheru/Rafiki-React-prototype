// src/pages/Landing.jsx
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Divider,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SchoolIcon from "@mui/icons-material/School";
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import { Link as RouterLink } from "react-router-dom";

/*
  Updated landing page:
  - question-style hero copy (no large hero image)
  - solid AppBar (hides on scroll down, shows on scroll up)
  - cleaner founder card
  - keeps Material UI, responsive
*/

export default function Landing() {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);

  // hide-on-scroll (simple)
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY + 10) setNavHidden(true); // scrolling down
      else if (y < lastY - 10) setNavHidden(false); // scrolling up
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Market", to: "/market" },
    { label: "Code Craft", to: "/lms" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  // Hero question copy (short + strong)
  const heroQuestion = `
Ever wanted something but didn’t want to walk all over town, haggle endlessly, or risk getting scammed online? 
With Rafiki, you simply describe what you need, add your budget, and post it. Instantly, your request goes public, 
meaning verified vendors can respond, and other buyers can see and compare deals.

But Rafiki isn’t just about buying and selling. It’s about restoring trust and transparency in how we trade and connect. 
Every seller is vetted, every post accountable, and your reputation grows with your actions. In most social apps, 
scammers get reported, disappear, then return under a new name, repeating the same cycle. Here, that cycle ends. 
Integrity matters. Accountability follows you.

And it doesn’t stop at the market. You can also share your skills, projects, and ideas, let your process speak for itself. 
Rafiki becomes your open portfolio, where learners, creators, and innovators showcase their craft. Maybe you’re not selling a 
product but an idea, pitch it. Someone out there might have the resources, mentorship, or network you need, but doesn’t yet 
know where to invest.

Think of it as a virtual Shark Tank built on community and trust, a place where opportunity is shared, not gated. 
Where your talent, honesty, and creativity become your true currency.

Rafiki is more than an app, it’s a vision for a connected Africa, where we trade, learn, and grow together.
`;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa" }}>
      <AppBar
        position="fixed"
        elevation={4}
        sx={{
          background: "#fff",
          color: theme.palette.text.primary,
          transition: "transform 240ms ease",
          transform: navHidden ? "translateY(-110%)" : "translateY(0)",
          zIndex: (t) => t.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: "none",
              color: theme.palette.rafiki?.main || theme.palette.primary.main,
              fontWeight: 700,
              mr: 2,
            }}
          >
            Rafiki
          </Typography>

          <Box sx={{ flex: 1 }} />

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
            <Button component={RouterLink} to="/about" color="inherit" sx={{ color: "#666" }}>
              About
            </Button>
            <Button component={RouterLink} to="/contact" color="inherit" sx={{ color: "#666" }}>
              Contact
            </Button>
            <Button component={RouterLink} to="/signup" variant="outlined" sx={{ mr: 1 }}>
              Sign up
            </Button>
            <Button component={RouterLink} to="/login" variant="contained" color="primary">
              Login
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer (mobile) */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280, p: 2 }}>
          <Typography variant="h6" sx={{ color: theme.palette.rafiki?.main, fontWeight: 700 }}>
            Rafiki
          </Typography>
          <List>
            {navItems.map((n) => (
              <ListItemButton key={n.label} component={RouterLink} to={n.to} onClick={() => setDrawerOpen(false)}>
                <ListItemText primary={n.label} />
              </ListItemButton>
            ))}
          </List>
          <Box sx={{ mt: 2 }}>
            <Button component={RouterLink} to="/signup" variant="contained" fullWidth color="primary">
              Get started
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* push content below fixed AppBar */}
      <Toolbar />

      {/* HERO */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 800, mb: 2, lineHeight: 1.08 }}>
              What if finding what you need (or being found) was that simple?
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 2, textAlign:"justify" }}>
              {heroQuestion}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              <Button component={RouterLink} to="/signup" variant="contained" color="primary" size="large">
                Create account
              </Button>
              <Button component={RouterLink} to="/market" variant="outlined" size="large">
                Explore market
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <Divider />

      {/* About / Market Section */}
     <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
  <Grid container spacing={4}>
    <Grid item xs={12} md={8}>
      <Typography variant="h5" gutterBottom>
         Code Craft 
      </Typography>

      <Typography color="text.secondary" paragraph>
              A compact curriculum that treats the computer as an amplifier of your talent.
              Learn tools or build them, showcase your process and let scouts discover you safely.
              Rafiki brings market opportunities and learning together, protecting learners while
              opening doors.
      </Typography>

    </Grid>
  </Grid>
</Container>
  <Divider />

   {/* Founders Section */}
<Container
  maxWidth="lg"
  sx={{
    py: { xs: 4, md: 6 },
    borderTop: "1px solid #eee",
    mt: 6,
  }}
>
  <Typography variant="h4" gutterBottom textAlign="center">
    Meet the Founders
  </Typography>

  <Grid
    container
    spacing={4}
    alignItems="flex-start"
    justifyContent="space-between"
  >
    {/* Ney Gacheru */}
    <Grid
      item
      xs={12}
      md={6}
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Avatar
        src="/images/ney.jpg"
        alt="Ney Gacheru"
        sx={{
          width: 100,
          height: 100,
          mb: 2,
          boxShadow: 2,
          border: "2px solid #ff9800",
        }}
        variant="rounded"
      />
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        Ney Gacheru — Co-founder
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mt: 1,
          textAlign: "justify",
          maxWidth: 420,
        }}
      >
        “I imagine a world where you don’t have to walk town, haggle, or risk a
        bad deal. Rafiki lets you describe what you need, your budget, and
        connect with honest vendors — or showcase your skills and be discovered.
        It’s where ideas, effort, and trust build real opportunity.”
      </Typography>
    </Grid>

    {/* Michelle Michuki */}
    <Grid
      item
      xs={12}
      md={6}
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Avatar
        src="/images/michelle.jpg"
        alt="Michelle Michuki"
        sx={{
          width: 100,
          height: 100,
          mb: 2,
          boxShadow: 2,
          border: "2px solid #ff9800",
        }}
        variant="rounded"
      />
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        Michelle Michuki — Co-founder
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mt: 1,
          textAlign: "justify",
          maxWidth: 420,
        }}
      >
        “Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at
        nisi eget magna porta luctus. Passionate about learning, people, and
        shaping the next generation of innovators through creativity and
        compassion.”
      </Typography>
    </Grid>
  </Grid>
</Container>

      <Divider />

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: "#fff", borderTop: "1px solid rgba(0,0,0,0.04)" }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Grid container spacing={3} justifyContent="space-between" alignItems="flex-start">
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: theme.palette.rafiki?.main, fontWeight: 700 }}>
                Rafiki
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Community market • Code Craft.
              </Typography>
            </Grid>

            <Grid item xs={6} md={3}>
              <Typography variant="subtitle2">Contact</Typography>
              <Typography variant="body2">
                <a href="mailto:hello@rafiki.example" style={{ textDecoration: "none", color: theme.palette.primary.main }}>
                  rafiki
                </a>
              </Typography>
            </Grid>

            <Grid item xs={6} md={3}>
              <Typography variant="subtitle2">Legal</Typography>
              <Stack spacing={1}>
                <Button component={RouterLink} to="/terms" sx={{ justifyContent: "flex-start" }} size="small">Terms</Button>
                <Button component={RouterLink} to="/privacy" sx={{ justifyContent: "flex-start" }} size="small">Privacy</Button>
              </Stack>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, textAlign: "center", color: "text.secondary" }}>
            © {new Date().getFullYear()} Rafiki — All rights reserved.
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
