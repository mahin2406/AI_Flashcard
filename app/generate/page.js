'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
  InputBase
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { getFirestore, writeBatch, doc, collection, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newAnswer, setNewAnswer] = useState('');
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ text }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      if (Array.isArray(data) && data.every(item => item.question && item.answer)) {
        setFlashcards(data);
        setFlipped({}); // Reset flip state
      } else {
        console.error('Received invalid data:', data);
        setFlashcards([{ question: 'Error', answer: 'Received invalid data from the server.' }]);
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      setFlashcards([{ question: 'Error', answer: 'An error occurred. Please try again.' }]);
    }
  };

  const handleCardClick = (index) => {
    setFlipped(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveFlashcards = async () => {
    if (!name) {
      alert('Please enter a name');
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, 'users'), user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f) => f.name === name)) {
        alert('Flashcard collection with this name already exists.');
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });

    await batch.commit();
    handleClose();
    router.push('/flashcards');
  };

  const handleDelete = (index) => {
    setFlashcards(flashcards.filter((_, i) => i !== index));
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setNewAnswer(flashcards[index].answer);
  };

  const handleEditSave = () => {
    setFlashcards(flashcards.map((flashcard, index) => 
      index === editingIndex ? { ...flashcard, answer: newAnswer } : flashcard
    ));
    setEditingIndex(null);
    setNewAnswer('');
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        bgcolor: darkMode ? '#121212' : '#f5f5f5',
        color: darkMode ? '#e0e0e0' : '#333',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        px: 2,
        overflowX: 'hidden',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '1200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'space-between',
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: 'center',
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: '1.5rem', md: '2rem' },
            }}
          >
            Generate Flashcards
          </Typography>
          <IconButton
            onClick={() => setDarkMode(!darkMode)}
            sx={{ color: darkMode ? '#fff' : '#000' }}
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>

        <Paper
          sx={{
            p: 4,
            bgcolor: darkMode ? '#333' : '#fff',
            color: darkMode ? '#e0e0e0' : '#333',
            width: '100%',
            maxWidth: '800px',
            borderRadius: 2,
            boxShadow: darkMode ? '0 4px 8px rgba(0, 0, 0, 0.5)' : '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter your text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{
              mb: 2,
              input: { color: darkMode ? '#e0e0e0' : '#000' },
              textarea: { color: darkMode ? '#e0e0e0' : '#000' },
              bgcolor: darkMode ? '#444' : '#fff',
            }}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: '#ff7043',
              '&:hover': { backgroundColor: '#ff5722' },
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '2px',
                backgroundColor: '#fff',
                transform: 'scaleX(0)',
                transformOrigin: 'bottom right',
                transition: 'transform 0.3s ease-out',
              },
              '&:hover::after': {
                transform: 'scaleX(1)',
                transformOrigin: 'bottom left',
              },
            }}
          >
            Generate Flashcards
          </Button>
        </Paper>
      </Box>

      {flashcards.length > 0 && (
        <Box sx={{ width: '100%', maxWidth: '1200px', mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              textAlign: 'center',
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: '1.25rem', md: '1.5rem' },
            }}
          >
            Flashcards Preview
          </Typography>
          <Grid container spacing={3}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    bgcolor: darkMode ? '#1e1e1e' : '#fff',
                    color: darkMode ? '#e0e0e0' : '#000',
                    borderRadius: 2,
                    boxShadow: darkMode ? '0 4px 8px rgba(0, 0, 0, 0.5)' : '0 4px 8px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                  }}
                >
                  <CardActionArea onClick={() => handleCardClick(index)}>
                    <CardContent sx={{ position: 'relative', height: '200px' }}>
                      <Box
                        sx={{
                          position: 'relative',
                          width: '100%',
                          height: '100%',
                          transformStyle: 'preserve-3d',
                          transition: 'transform 0.6s',
                          transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        }}
                      >
                        <Box
                          className="card-front"
                          sx={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 2,
                            boxSizing: 'border-box',
                            borderRadius: 2,
                            backgroundColor: darkMode ? '#333' : '#fff',
                            color: darkMode ? '#e0e0e0' : '#000',
                          }}
                        >
                          <Typography variant="h6">{flashcard.question}</Typography>
                        </Box>
                        <Box
                          className="card-back"
                          sx={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 2,
                            boxSizing: 'border-box',
                            borderRadius: 2,
                            backgroundColor: darkMode ? '#444' : '#f5f5f5',
                            color: darkMode ? '#e0e0e0' : '#000',
                            transform: 'rotateY(180deg)',
                          }}
                        >
                          {editingIndex === index ? (
                            <>
                              <InputBase
                                value={newAnswer}
                                onChange={(e) => setNewAnswer(e.target.value)}
                                multiline
                                sx={{ width: '100%', mb: 2, bgcolor: darkMode ? '#555' : '#fff', p: 1, borderRadius: 1 }}
                              />
                              <Button
                                variant="contained"
                                onClick={handleEditSave}
                                sx={{
                                  backgroundColor: '#4caf50',
                                  '&:hover': { backgroundColor: '#388e3c' },
                                }}
                              >
                                Save
                              </Button>
                            </>
                          ) : (
                            <Typography variant="body1">{flashcard.answer}</Typography>
                          )}
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              display: 'flex',
                              gap: 1,
                            }}
                          >
                            {/* Comment out or remove this line to hide the EditIcon */}
                            {/* <IconButton onClick={() => handleEditClick(index)}>
                              <EditIcon />
                            </IconButton> */}
                            <IconButton onClick={() => handleDelete(index)}>
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>

              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Fade in={flashcards.length > 0} timeout={500}>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleOpen}
            sx={{
              backgroundColor: '#4caf50',
              '&:hover': { backgroundColor: '#388e3c' },
            }}
          >
            Save Flashcards
          </Button>
        </Box>
      </Fade>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save Flashcards</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcard collection.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Collection Name"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveFlashcards}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
