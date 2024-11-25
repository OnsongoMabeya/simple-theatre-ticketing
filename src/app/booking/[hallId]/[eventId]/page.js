'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  CircularProgress
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChairIcon from '@mui/icons-material/Chair';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

export default function BookingPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [hallId, eventId] = pathname.split('/').slice(-2);
  
  const [hall, setHall] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({ name: '', phone: '' });
  const [openDialog, setOpenDialog] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchEventData();
  }, [hallId, eventId]);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/events/${hallId}/${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to load event data');
      }
      const data = await response.json();
      if (!data.hall || !data.event) {
        throw new Error('Event or hall not found');
      }
      
      // Calculate available seats
      const totalSeats = data.hall.rows * data.hall.seatsPerRow;
      const bookedSeatsCount = data.event.bookedSeats ? data.event.bookedSeats.length : 0;
      data.event.availableSeats = totalSeats - bookedSeatsCount;
      
      setHall(data.hall);
      setEvent(data.event);
    } catch (error) {
      console.error('Error loading event:', error);
      setError(error.message || 'Failed to load event data');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seatId) => {
    if (!event || !event.bookedSeats) return;
    
    if (event.bookedSeats.includes(seatId)) {
      return; // Seat is already booked
    }

    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const handleBooking = async () => {
    if (!customerDetails.name || !customerDetails.phone) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    if (selectedSeats.length === 0) {
      setErrorMessage('Please select at least one seat');
      return;
    }

    try {
      const bookingData = {
        referenceNumber: 'BOK' + Date.now(),
        customerName: customerDetails.name,
        phone: customerDetails.phone,
        eventDetails: {
          eventId: event.id,
          eventName: event.name,
          hallId: parseInt(hallId),
          hallName: hall.name,
          date: event.date,
          time: event.time
        },
        seats: selectedSeats,
        totalPrice: selectedSeats.length * event.price,
        bookingDate: new Date().toISOString(),
        status: 'confirmed'
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingData,
          selectedSeats,
          hallId: parseInt(hallId),
          eventId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to book seats');
      }

      const data = await response.json();
      setBookingReference(data.referenceNumber);
      setOpenDialog(true);
      setSuccessMessage('Booking successful!');
      setSelectedSeats([]);
      setCustomerDetails({ name: '', phone: '' });
      
      // Refresh event data to get updated seat availability
      fetchEventData();
    } catch (error) {
      setErrorMessage(error.message || 'Failed to book seats. Please try again.');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleGoHome = () => {
    router.push('/');
  };

  // Convert row number to letter (1 = A, 2 = B, etc.)
  const getRowLetter = (rowIndex) => {
    return String.fromCharCode(65 + rowIndex); // 65 is ASCII for 'A'
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh' 
      }}>
        <CircularProgress sx={{ color: '#145da0' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button 
          component={Link} 
          href="/"
          variant="contained"
          sx={{ 
            mt: 2,
            backgroundColor: '#145da0',
            '&:hover': { backgroundColor: '#0c2d48' }
          }}
        >
          Return to Home
        </Button>
      </Box>
    );
  }

  if (!hall || !event) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Event not found
        </Typography>
        <Button 
          component={Link} 
          href="/"
          variant="contained"
          sx={{ 
            mt: 2,
            backgroundColor: '#145da0',
            '&:hover': { backgroundColor: '#0c2d48' }
          }}
        >
          Return to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 1400, margin: '0 auto', bgcolor: '#ffffff' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4 
      }}>
        <Button 
          component={Link}
          href="/"
          startIcon={<HomeIcon />}
          sx={{ color: '#145da0' }}
        >
          Back to Home
        </Button>
        <Typography variant="h4" sx={{ color: '#145da0', fontWeight: 'bold' }}>
          {event.name}
        </Typography>
        <Box sx={{ width: 100 }} />
      </Box>

      <Grid container spacing={3}>
        {/* Left Side - Customer Details */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 3, 
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            position: 'sticky',
            top: '20px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {/* Event Image */}
            <Box sx={{ 
              width: '100%',
              height: '200px',
              position: 'relative',
              mb: 3,
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <Image
                src={event.imageUrl}
                alt={event.name}
                fill
                style={{ 
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
                priority
              />
            </Box>

            <Typography variant="h6" sx={{ color: '#145da0', mb: 3, textAlign: 'center' }}>
              Customer Details
            </Typography>
            <TextField
              fullWidth
              required
              label="Name"
              variant="outlined"
              value={customerDetails.name}
              onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
              sx={{ mb: 2, bgcolor: '#f5f5f5' }}
            />
            <TextField
              fullWidth
              required
              label="Phone Number"
              variant="outlined"
              value={customerDetails.phone}
              onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
              sx={{ mb: 3, bgcolor: '#f5f5f5' }}
            />
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography sx={{ color: '#145da0', mb: 1 }}>
                Selected Seats: {selectedSeats.join(', ')}
              </Typography>
              <Typography variant="h6" sx={{ color: '#145da0', fontWeight: 'bold' }}>
                Total Price: ${selectedSeats.length * event.price}
              </Typography>
            </Box>
            <Button
              fullWidth
              variant="contained"
              onClick={handleBooking}
              disabled={selectedSeats.length === 0}
              sx={{
                bgcolor: '#145da0',
                color: '#ffffff',
                py: 1.5,
                '&:hover': { bgcolor: '#2e8bc0' },
                '&:disabled': { bgcolor: '#e0e0e0' }
              }}
            >
              Confirm Booking
            </Button>
          </Paper>
        </Grid>

        {/* Right Side - Seat Selection */}
        <Grid item xs={12} md={8}>
          {/* Event Details */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ color: '#145da0', mb: 2 }}>
              Event Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, bgcolor: '#ffffff', border: '1px solid #e0e0e0' }}>
                  <Typography variant="body1" sx={{ mb: 1, color: '#145da0' }}>
                    <CalendarTodayIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Date: {event.date}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#145da0' }}>
                    <AccessTimeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Time: {event.time}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, bgcolor: '#ffffff', border: '1px solid #e0e0e0' }}>
                  <Typography variant="body1" sx={{ mb: 1, color: '#145da0' }}>
                    <ChairIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Available Seats: {event.availableSeats}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#145da0' }}>
                    <AttachMoneyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Price per Seat: ${event.price}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Seat Legend */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 3, 
            mb: 4,
            flexWrap: 'wrap',
            p: 2,
            bgcolor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 20, height: 20, backgroundColor: '#2e8bc0', borderRadius: 1 }} />
              <Typography sx={{ color: '#145da0' }}>Available</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 20, height: 20, backgroundColor: '#145da0', borderRadius: 1 }} />
              <Typography sx={{ color: '#145da0' }}>Selected</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 20, height: 20, backgroundColor: '#e0e0e0', borderRadius: 1 }} />
              <Typography sx={{ color: '#145da0' }}>Booked</Typography>
            </Box>
          </Box>

          {/* Stage */}
          <Box sx={{ 
            width: '100%', 
            height: 40, 
            bgcolor: '#f5f5f5',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4,
            border: '1px solid #e0e0e0'
          }}>
            <Typography sx={{ color: '#145da0', fontWeight: 'medium' }}>STAGE</Typography>
          </Box>

          {/* Seat Grid */}
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1
          }}>
            {Array.from({ length: hall.rows }).map((_, rowIndex) => (
              <Box 
                key={rowIndex}
                sx={{ 
                  display: 'flex',
                  gap: 1,
                  alignItems: 'center'
                }}
              >
                <Typography sx={{ 
                  minWidth: 30, 
                  color: '#0c2d48',
                  textAlign: 'right'
                }}>
                  {getRowLetter(rowIndex)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {Array.from({ length: hall.seatsPerRow }).map((_, colIndex) => {
                    const seatId = `${getRowLetter(rowIndex)}-${colIndex + 1}`;
                    const isBooked = event.bookedSeats.includes(seatId);
                    const isSelected = selectedSeats.includes(seatId);

                    return (
                      <Button
                        key={colIndex}
                        variant="contained"
                        onClick={() => handleSeatClick(seatId)}
                        disabled={isBooked}
                        sx={{
                          minWidth: '36px',
                          height: '36px',
                          p: 0,
                          backgroundColor: isBooked 
                            ? '#e0e0e0' 
                            : isSelected 
                              ? '#145da0'
                              : '#2e8bc0',
                          '&:hover': {
                            backgroundColor: isBooked 
                              ? '#e0e0e0'
                              : isSelected 
                                ? '#145da0'
                                : '#0c2d48'
                          },
                          '&.Mui-disabled': {
                            backgroundColor: '#e0e0e0'
                          }
                        }}
                      >
                        {colIndex + 1}
                      </Button>
                    );
                  })}
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            p: 2,
            minWidth: '320px'
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center',
          color: '#0c2d48',
          fontWeight: 'bold'
        }}>
          Booking Confirmed!
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h6" sx={{ color: '#145da0', mb: 2 }}>
              Reference Number:
            </Typography>
            <Typography variant="h5" sx={{ 
              color: '#0c2d48',
              fontWeight: 'bold',
              mb: 3 
            }}>
              {bookingReference}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Please keep this reference number for your records.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Present it at the theatre entrance for payment.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          justifyContent: 'center',
          gap: 2,
          pb: 3 
        }}>
          <Button 
            onClick={handleGoHome}
            variant="contained"
            sx={{
              backgroundColor: '#145da0',
              '&:hover': { backgroundColor: '#0c2d48' }
            }}
          >
            Go to Home
          </Button>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              color: '#145da0',
              borderColor: '#145da0',
              '&:hover': { 
                borderColor: '#0c2d48',
                color: '#0c2d48'
              }
            }}
          >
            Book More Seats
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
        message={errorMessage}
        sx={{ '& .MuiSnackbarContent-root': { backgroundColor: '#ff3d00' } }}
      />
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        message={successMessage}
        sx={{ '& .MuiSnackbarContent-root': { backgroundColor: '#43a047' } }}
      />
    </Box>
  );
}
