'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Checkbox,
  TextField,
  InputAdornment,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = sessionStorage.getItem('adminToken');
    if (!adminToken || adminToken !== 'logged-in') {
      router.push('/');
      return;
    }
    setIsAuthenticated(true);
    fetchBookings();
  }, [router]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      setBookings(data.bookings || []); // Access the bookings array from the data
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredBookings = bookings.filter(booking => 
    booking.eventDetails.eventName.toLowerCase().includes(searchTerm) ||
    booking.customerName.toLowerCase().includes(searchTerm) ||
    booking.seats.join(', ').toLowerCase().includes(searchTerm) ||
    booking.referenceNumber.toLowerCase().includes(searchTerm)
  );

  const handleCheckIn = async (bookingId) => {
    try {
      const response = await fetch('/api/bookings/check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
      });
      if (response.ok) {
        fetchBookings(); // Refresh the bookings list
      }
    } catch (error) {
      console.error('Error updating check-in status:', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    router.push('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        borderBottom: '2px solid #145da0',
        pb: 2
      }}>
        <Typography variant="h4" sx={{ color: '#145da0' }}>
          Theatre Bookings Administration
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={handleLogout}
          sx={{ 
            borderColor: '#145da0', 
            color: '#145da0',
            '&:hover': {
              borderColor: '#145da0',
              backgroundColor: 'rgba(20, 93, 160, 0.04)'
            }
          }}
        >
          Logout
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search bookings by event name, customer, seat, or reference number..."
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#145da0' }}>
              <TableCell sx={{ color: 'white' }}>Reference</TableCell>
              <TableCell sx={{ color: 'white' }}>Event</TableCell>
              <TableCell sx={{ color: 'white' }}>Customer</TableCell>
              <TableCell sx={{ color: 'white' }}>Seats</TableCell>
              <TableCell sx={{ color: 'white' }}>Date & Time</TableCell>
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
              <TableCell sx={{ color: 'white' }}>Check-in</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.referenceNumber} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell>{booking.referenceNumber}</TableCell>
                <TableCell>{booking.eventDetails.eventName}</TableCell>
                <TableCell>{booking.customerName}</TableCell>
                <TableCell>{booking.seats.join(', ')}</TableCell>
                <TableCell>
                  {new Date(booking.eventDetails.date).toLocaleDateString()} {booking.eventDetails.time}
                </TableCell>
                <TableCell>
                  {booking.checkedIn ? (
                    <CheckCircleIcon sx={{ color: 'green' }} />
                  ) : (
                    <CancelIcon sx={{ color: 'red' }} />
                  )}
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={booking.checkedIn || false}
                    onChange={() => handleCheckIn(booking.referenceNumber)}
                    disabled={booking.checkedIn}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
