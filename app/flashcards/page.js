"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppBar, Container, Toolbar, Button, Typography, Grid, Card, CardActionArea, CardContent, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Box } from "@mui/material";
import { useUser } from "@clerk/nextjs";
import { collection, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";
import RemoveCircleTwoToneIcon from "@mui/icons-material/RemoveCircleTwoTone";

export default function Flashcard() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser(); 

  useEffect(() => {
    async function getFlashcards() {
      if (!isLoaded || !isSignedIn || !user) return;

      try {
        const docRef = doc(db, 'users', user.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const collections = docSnap.data().flashcards || [];
          setCollections(collections);
        } else {
          await setDoc(docRef, { flashcards: [] });
        }
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      } finally {
        setLoading(false);
      }
    }

    getFlashcards();
  }, [user, isLoaded, isSignedIn]);

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  const handleBack = () => {
    router.push(`/generate`);
  };

  const handleHome = () => {
    router.push(`/`);
  };

  const handleLogout = async () => {
    await clerk.signOut(); // Sign out using Clerk
    router.push(`/`); // Redirect to sign-in page after logout
  };

  const handleOpenDialog = (collection) => {
    setSelectedCollection(collection);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCollection(null);
  };

  const handleDeleteCollection = async () => {
    if (!user || !selectedCollection || !selectedCollection.id) return;

    const userDocRef = doc(db, "users", user.id);
    const collectionRef = collection(userDocRef, "flashcards");
    const docRef = doc(collectionRef, selectedCollection.id);

    try {
      await deleteDoc(docRef);

      setCollections((prevCollections) =>
        prevCollections.filter((collection) => collection.id !== selectedCollection.id)
      );
      handleCloseDialog();
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "White",
          position: "relative",
        }}
      >
        <AppBar
          position="fixed"
          sx={{ backgroundColor: "#2f54ba", width: "100%", zIndex: 3 }}
        >
          <Toolbar>
            <Button sx={{ textTransform: "none" }} onClick={handleHome}>
              <Typography
                variant="h6"
                sx={{ flexGrow: 1, color: "white", fontFamily: "cursive" }}
              >
                EasyLearning
              </Typography>
            </Button>
            <Box sx={{ flexGrow: 1 }} /> {/* Spacer */}
            <Box sx={{ display: "flex", gap: "16px" }}>
              <Button color="inherit" onClick={handleBack}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "white",
                    fontSize: "1rem",
                    fontFamily: "sans-serif",
                  }}
                >
                  Back
                </Typography>
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "white",
                    fontSize: "1rem",
                    fontFamily: "sans-serif",
                  }}
                >
                  Logout
                </Typography>
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            position: "absolute",
            left: 200,
            top: 100,
            width: "100%",
            height: "100%",
            zIndex: 1,
            display: { xs: "none", md: "block" },
            overflow: "hidden",
          }}
        ></Box>
        <Grid container spacing={3} sx={{ mt: 10, zIndex: 2 }}>
          {collections.map((collection, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              sx={{ position: "relative" }}
            >
              <Card>
                <CardActionArea
                  onClick={() => handleCardClick(collection.id)}
                >
                  <CardContent>
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                      {collection.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    color: "red",
                  }}
                  onClick={() => handleOpenDialog(collection)}
                >
                  <RemoveCircleTwoToneIcon />
                </IconButton>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography sx={{ fontFamily: "sans-serif" }}>
              Are you sure you want to delete this collection?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              color="primary"
              sx={{ fontFamily: "sans-serif" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteCollection}
              variant="contained"
              sx={{ fontFamily: "sans-serif", color: "white" }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}
