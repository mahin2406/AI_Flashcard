'use client';
import { useEffect, useState } from "react";
import getStripe from "@/utils/get-stripe";
import { useAuth, useClerk, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Head from "next/head";
import { useRouter } from "next/navigation";
import { Container, Button, Toolbar, Typography, AppBar, Box, Grid, Paper, Slide, Zoom, Fade } from "@mui/material";
import "@fontsource/poppins"; // Importing the 'Poppins' font

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const { isSignedIn } = useAuth();
  const { openSignIn, openSignUp } = useClerk();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push('/generate');
    } else {
      openSignIn();
    }
  };

  const handleCheckout = async (plan) => {
    if (!isSignedIn) {
      openSignIn({
        afterSignInUrl: () => handleCheckout(plan),
      });
      return;
    }

    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate checkout.');
      }

      const { sessionId } = await response.json();
      const stripe = await getStripe();
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <Head>
        <title>EasyLearning</title>
        <meta name="description" content="Create flashcards from your text" />
      </Head>

      <AppBar position="fixed" sx={{ backgroundColor: "#292929", borderBottom: "3px solid #ff7043" }}>
        <Toolbar>
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              color: "#ff7043",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: '700',
              fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
              letterSpacing: '0.1rem',
              textTransform: 'uppercase',
              transition: "color 0.3s",
              "&:hover": {
                color: "#ff5722",
              },
            }}
          >
            EasyLearning
          </Typography>
          <SignedOut>
            <Button color="inherit" sx={{ color: "#ff7043", mr: 1 }} onClick={openSignIn}>
              Login
            </Button>
            <Button color="inherit" sx={{ backgroundColor: "#ff7043", color: "#fff" }} onClick={openSignUp}>
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      {/* Main content section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: '#f5f5f5',
          color: '#333',
          pt: 10,
          textAlign: "center",
        }}
      >
        <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
          <Zoom in timeout={1000}>
            <Box sx={{ textAlign: "center", my: { xs: 4, sm: 6, md: 9 } }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: '700',
                  mb: 2,
                  color: "#ff7043",
                  fontFamily: "'Poppins', sans-serif",
                  letterSpacing: '0.1rem',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                }}
              >
                Welcome to EasyLearning
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
                Your Smartest Way to Create Flashcards from Text
              </Typography>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  py: 1.5,
                  px: 3,
                  backgroundColor: '#ff7043',
                  color: '#fff',
                  fontWeight: '600',
                  letterSpacing: '0.05rem',
                  '&:hover': {
                    backgroundColor: '#ff5722',
                  },
                }}
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </Box>
          </Zoom>

          {/* Features section */}
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Slide direction="up" in timeout={700}>
                <Paper
                  elevation={3}
                  sx={{
                    padding: 4,
                    textAlign: 'center',
                    backgroundColor: "#fff",
                    borderRadius: 3,
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Easy Text Input
                  </Typography>
                  <Typography>
                    Enter text, and we&apos;ll generate flashcards effortlessly.
                  </Typography>
                </Paper>
              </Slide>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Slide direction="up" in timeout={800}>
                <Paper
                  elevation={3}
                  sx={{
                    padding: 4,
                    textAlign: 'center',
                    backgroundColor: "#fff",
                    borderRadius: 3,
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Accessible Anywhere
                  </Typography>
                  <Typography>
                    Access your flashcards on any device, anywhere.
                  </Typography>
                </Paper>
              </Slide>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Slide direction="up" in timeout={900}>
                <Paper
                  elevation={3}
                  sx={{
                    padding: 4,
                    textAlign: 'center',
                    backgroundColor: "#fff",
                    borderRadius: 3,
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Smart Flashcards
                  </Typography>
                  <Typography>
                    AI-powered flashcards optimized for learning efficiency.
                  </Typography>
                </Paper>
              </Slide>
            </Grid>
          </Grid>

          {/* Pricing section */}
          <Box sx={{ my: 6, textAlign: "center" }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#ff7043', letterSpacing: '0.1rem', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
              Pricing Plans
            </Typography>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6} md={6}>
                <Fade in timeout={800}>
                  <Box
                    sx={{
                      p: 4,
                      border: "2px solid #ff7043",
                      borderRadius: 4,
                      backgroundColor: '#fff',
                      textAlign: 'center',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Basic Plan
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                      Free
                    </Typography>
                    <Typography>
                      Access limited features and storage.
                    </Typography>
                    <Button
                      variant="outlined"
                      sx={{
                        mt: 2,
                        color: "#ff7043",
                        borderColor: "#ff7043",
                        '&:hover': {
                          backgroundColor: '#ffe5db',
                        },
                      }}
                      onClick={handleGetStarted}
                    >
                      Choose Basic
                    </Button>
                  </Box>
                </Fade>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <Fade in timeout={900}>
                  <Box
                    sx={{
                      p: 4,
                      border: "2px solid #ff7043",
                      borderRadius: 4,
                      backgroundColor: '#fff',
                      textAlign: 'center',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Pro Plan
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                      $9.99/month
                    </Typography>
                    <Typography>
                      Access all features and unlimited storage.
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        mt: 2,
                        backgroundColor: '#ff7043',
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: '#ff5722',
                        },
                      }}
                      onClick={() => handleCheckout('pro')}
                    >
                      Choose Pro
                    </Button>
                  </Box>
                </Fade>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
}
