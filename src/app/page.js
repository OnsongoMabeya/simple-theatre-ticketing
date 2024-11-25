'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  InputAdornment
} from '@mui/material';
import { useRouter } from 'next/navigation';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChairIcon from '@mui/icons-material/Chair';
import SearchIcon from '@mui/icons-material/Search';
import AdminLoginModal from '@/components/AdminLoginModal';

export default function Home() {
  const [theatreData, setTheatreData] = useState({ halls: [] });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [adminKeySequence, setAdminKeySequence] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setTheatreData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      setAdminKeySequence(prev => {
        const newSequence = (prev + event.key).slice(-5);
        if (newSequence === 'admin') {
          setLoginModalOpen(true);
          return '';
        }
        return newSequence;
      });
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  const handleBooking = (hallId, eventId) => {
    router.push(`/booking/${hallId}/${eventId}`);
  };

  const filterEvents = (halls, query) => {
    if (!query) return halls;

    return halls.map(hall => ({
      ...hall,
      events: hall.events.filter(event =>
        event.name.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase()) ||
        hall.name.toLowerCase().includes(query.toLowerCase()) ||
        event.date.includes(query)
      )
    })).filter(hall => hall.events.length > 0);
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const filteredHalls = filterEvents(theatreData.halls, searchQuery);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom 
        sx={{ 
          color: '#145da0',
          fontWeight: 'bold',
          textAlign: 'center',
          mb: 4
        }}
      >
        Theatre Events
      </Typography>

      {/* Search Box */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search events by name, description, venue, or date..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            maxWidth: '600px',
            bgcolor: '#ffffff',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#145da0',
              },
              '&:hover fieldset': {
                borderColor: '#2e8bc0',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#145da0',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#145da0' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      <Grid container spacing={4}>
        {filteredHalls.map((hall) => (
          <Grid item xs={12} md={6} key={hall.id}>
            <Card sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              bgcolor: '#ffffff'
            }}>
              <Typography
                variant="h5"
                sx={{
                  bgcolor: '#f5f5f5',
                  color: '#145da0',
                  p: 2,
                  fontWeight: 'bold',
                  borderBottom: '2px solid #e0e0e0'
                }}
              >
                {hall.name}
              </Typography>
              
              <Box sx={{ p: 2, flexGrow: 1, bgcolor: '#ffffff' }}>
                {hall.events.map((event) => (
                  <Card
                    key={event.id}
                    sx={{
                      mb: 2,
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                      '&:last-child': { mb: 0 }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={event.imageUrl}
                      alt={event.name}
                      sx={{ 
                        height: 200,
                        objectFit: 'cover',
                        objectPosition: 'center'
                      }}
                    />
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#145da0', mb: 1 }}>
                        {event.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {event.description}
                      </Typography>
                      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                        <Chip
                          icon={<CalendarTodayIcon />}
                          label={event.date}
                          size="small"
                          sx={{ bgcolor: '#f5f5f5' }}
                        />
                        <Chip
                          icon={<AccessTimeIcon />}
                          label={event.time}
                          size="small"
                          sx={{ bgcolor: '#f5f5f5' }}
                        />
                        <Chip
                          icon={<ChairIcon />}
                          label={`${event.availableSeats} seats`}
                          size="small"
                          sx={{ bgcolor: '#f5f5f5' }}
                        />
                      </Stack>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleBooking(hall.id, event.id)}
                        sx={{
                          bgcolor: '#145da0',
                          '&:hover': { bgcolor: '#0c2d48' }
                        }}
                      >
                        Book Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <AdminLoginModal 
        open={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />
    </Container>
  );
}
