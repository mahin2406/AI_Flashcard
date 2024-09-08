'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { useAuth, useClerk, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Head from "next/head";
import { useRouter } from "next/navigation";
import { Container, Button, Toolbar, Typography, AppBar, Box, Grid } from "@mui/material";

export default function Home() {
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);
  const { isSignedIn } = useAuth(); // Get authentication status
  const { openSignIn } = useClerk(); // Sign-in method from Clerk
  const router = useRouter(); // For navigation

  useEffect(() => {
    setIsClient(true); // Ensure this runs client-side only
  }, []);

  // Handle "Get Started" button click
  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push('/generate'); // Redirect to the "generate" page if signed in
    } else {
      openSignIn(); // Open sign-in if the user is not signed in
    }
  };

  // Handle checkout process for Pro subscription
  const handleCheckout = async (plan) => {
    if (!isSignedIn) {
      // Open sign-in modal if the user is not signed in
      openSignIn();
      return; // Stop here until the user is signed in
    }
  
    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }), // Send plan type (e.g., 'pro')
      });
  
      if (!response.ok) {
        throw new Error('Failed to initiate checkout. Please try again.');
      }
  
      const { sessionId } = await response.json();
      const stripe = await getStripe(); // Get Stripe instance
  
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Error during checkout:', error);
      alert(error.message);
    }
  };

  return (
    <>
      <Head>
        <title>EasyLearning</title>
        <meta name="description" content="Create flashcard from your text" />
      </Head>

      <AppBar position="fixed" sx={{ backgroundColor: "#1f1f1f", width: "100%", borderBottom: "2px solid #444" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "#e0e0e0" }}>EasyLearning</Typography>
          <SignedOut>
            <Button color="inherit" onClick={openSignIn}>Login</Button>
            <Button color="inherit" onClick={openSignIn}>Sign Up</Button>
          </SignedOut>
          <SignedIn><UserButton /></SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#121212', color: '#e0e0e0', pt: 10 }}>
        <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
          <Box sx={{ textAlign: "center", my: 9 }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
              Welcome to EasyLearning
            </Typography>
            <Typography variant="h5" sx={{ mb: 4 }}>
              The easiest way to make flashcards from your text
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, backgroundColor: '#ff6f61', '&:hover': { backgroundColor: '#ff3b2a' } }}
              onClick={handleGetStarted} // Add handler for "Get Started"
            >
              Get Started
            </Button>
          </Box>

          <Box sx={{ my: 6, textAlign: "center" }}>
            <Typography variant="h4" component="h2" sx={{ mb: 4 }}>
              Features
            </Typography>
            <Grid container spacing={6}>
              <Grid item xs={12} md={4}>
                <Box sx={{ border: "2px solid #444", borderRadius: 2, padding: 3, bgcolor: '#1e1e1e' }}>
                  <Typography variant="h6" gutterBottom>Easy Text Input</Typography>
                  <Typography>Simply input your text and let our software do the rest.</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ border: "2px solid #444", borderRadius: 2, padding: 3, bgcolor: '#1e1e1e' }}>
                  <Typography variant="h6" gutterBottom>Accessible Anywhere</Typography>
                  <Typography>Access your flashcards from any device, at any time.</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ border: "2px solid #444", borderRadius: 2, padding: 3, bgcolor: '#1e1e1e' }}>
                  <Typography variant="h6" gutterBottom>Smart Flashcards</Typography>
                  <Typography>Our AI intelligently breaks down your text into concise flashcards, perfect for studying.</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ my: 6, textAlign: "center" }}>
            <Typography variant="h4" gutterBottom>Pricing</Typography>
            <Grid container spacing={6}>
              <Grid item xs={12} md={6}>
                <Box sx={{
                  p: 3,
                  border: "2px solid #444",
                  borderRadius: 2,
                  bgcolor: '#1e1e1e'
                }}>
                  <Typography variant="h6" gutterBottom>Basic</Typography>
                  <Typography variant="h5" gutterBottom>Free</Typography>
                  <Typography gutterBottom>Access to basic flashcard features and limited storage.</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, backgroundColor: '#ff6f61', '&:hover': { backgroundColor: '#ff3b2a' } }}
                    onClick={handleGetStarted} // Redirect to generate or sign in
                  >
                    Choose Basic
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{
                  p: 3,
                  border: "2px solid #444",
                  borderRadius: 2,
                  bgcolor: '#1e1e1e'
                }}>
                  <Typography variant="h6" gutterBottom>Pro</Typography>
                  <Typography variant="h5" gutterBottom>$10 / month</Typography>
                  <Typography gutterBottom>Access to unlimited flashcard features and storage.</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, backgroundColor: '#ff6f61', '&:hover': { backgroundColor: '#ff3b2a' } }}
                    onClick={handleCheckout.bind(null, 'pro')}
                  >
                    Choose Pro
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>

        <Box sx={{ bgcolor: '#121212', color: '#e0e0e0', p: 3, textAlign: 'center' }}>
          <Typography variant="body2">© 2024 Mahin Patel. All rights reserved.</Typography>
        </Box>
      </Box>
    </>
  );
}
