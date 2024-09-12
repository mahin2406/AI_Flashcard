"use client";
import {
  AppBar,
  Container,
  Grid,
  Button,
  Box,
  Card,
  Typography,
  Toolbar,
  CardActionArea,
  CardContent,
} from "@mui/material";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);

  const searchParams = useSearchParams();
  const search = searchParams.get('id');
  const router = useRouter();

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) {
        alert("Please sign in to view flashcard");
        return;
      }
      const colRef = collection(doc(collection(db, 'users'), user.id), search);
      console.log("col ref", colRef);
      const docs = await getDocs(colRef);
      const flashcards = [];
      console.log("docs", docs);

      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() });
      });
      console.log("flashcards", flashcards);

      setFlashcards(flashcards);
    }

    getFlashcard();
  }, [user, search]);
  
  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleHome = () => {
    router.push(`/`);
  };

  const handleBack = () => {
    router.push(`/flashcards`);
  };

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  return (
    <Container maxWidth="md" sx={{ pt: 8 }}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "White",
        }}
      >
        <AppBar
          position="fixed"
          sx={{ backgroundColor: "#2f54ba", width: "100%", zIndex: 2 }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              sx={{ flexGrow: 1, fontFamily: "cursive" }}
            >
              EasyLearning
            </Typography>
            <Button color="inherit" onClick={handleHome}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  fontSize: "1rem",
                  fontFamily: "serif",
                }}
              >
                Home
              </Typography>
            </Button>
            <Button color="inherit" onClick={handleBack}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  fontSize: "1rem",
                  fontFamily: "serif",
                }}
              >
                Back
              </Typography>
            </Button>
          </Toolbar>
        </AppBar>
        <Container
          maxWidth="md"
          sx={{ pt: 8, zIndex: 1, position: "relative" }}
        >
          <Box
            sx={{
              mt: 4,
              mb: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h3" gutterBottom fontFamily={"serif"}>
              {search}
            </Typography>
            <Grid container maxWidth="100vw" spacing={3} sx={{ mt: 4 }}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardActionArea onClick={() => handleCardClick(index)}>
                      <CardContent>
                        <Box
                          sx={{
                            perspective: "1000px",
                            "& > div": {
                              transition: "transform 0.6s",
                              transformStyle: "preserve-3d",
                              transform: flipped[index]
                                ? "rotateY(180deg)"
                                : "rotateY(0deg)",
                              position: "relative",
                              width: "100%",
                              height: "200px",
                              boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                              borderRadius: "8px",
                              display: "flex",
                              flexDirection: "column",
                            },
                            "& > div > div": {
                              backfaceVisibility: "hidden",
                              position: "absolute",
                              height: "100%",
                              width: "100%",
                              boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                              borderRadius: "8px",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center", // Center text
                              padding: 2,
                              boxSizing: "border-box",
                              overflowY: "auto",
                              textAlign: "center", // Ensure text is centered
                            },
                            "& > div > div:nth-child(2)": {
                              transform: "rotateY(180deg)",
                              backgroundColor: "#f5f5f5",
                              color: "black",
                              fontSize: "0.9rem",
                              fontFamily: "serif",
                            },
                          }}
                        >
                          <div>
                            <div>
                              <Typography
                                variant="h6"
                                component="div"
                                fontFamily={"serif"}
                              >
                                {flashcard.front}
                              </Typography>
                            </div>
                            <div>
                              <Typography
                                variant="body1"
                                component="div"
                                fontFamily={"serif"}
                              >
                                {flashcard.back}
                              </Typography>
                            </div>
                          </div>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </Container>
  );
}
