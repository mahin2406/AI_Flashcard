'use client'
import Image from "next/image"
import getStripe from "@/utils/get-stripe"
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Head from "next/head"
import { Container, Button, Toolbar, Typography, AppBar, Box } from "@mui/material"

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Head>
        <title>FlashCards</title>
        <meta name="description" content="Create flashcard from your text" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>Flashcard</Typography>
          <SignedOut>
            <Button color="inherit">Login</Button>
            <Button color="inherit">SignUp</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box>
        <Typography variant="h2">Welcome to Flashcard</Typography>
        <Typography variant="h5">
          The easiest way to make a flashcard from your text
        </Typography>
        <Button variant="contained" color="primary" sx={{mt:2}}>
          Get Started
        </Button>
      </Box>
      
    </Container>
  )
}
