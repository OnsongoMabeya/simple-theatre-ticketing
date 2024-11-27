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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, booking: null });
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
    booking.referenceNumber.toLowerCase().includes(searchTerm) ||
    (booking.phone && booking.phone.toLowerCase().includes(searchTerm))
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

  const handleDeleteClick = (booking) => {
    setDeleteDialog({ open: true, booking });
  };

  const handleDeleteClose = () => {
    setDeleteDialog({ open: false, booking: null });
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch('/api/bookings/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referenceNumber: deleteDialog.booking.referenceNumber,
          adminCredentials: {
            username: 'admin',
            password: 'admin'
          }
        }),
      });

      if (response.ok) {
        fetchBookings(); // Refresh the bookings list
        handleDeleteClose();
      } else {
        console.error('Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
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
              <TableCell sx={{ color: 'white' }}>Phone</TableCell>
              <TableCell sx={{ color: 'white' }}>Seats</TableCell>
              <TableCell sx={{ color: 'white' }}>Date & Time</TableCell>
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
              <TableCell sx={{ color: 'white' }}>Check-in</TableCell>
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.referenceNumber} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell>{booking.referenceNumber}</TableCell>
                <TableCell>{booking.eventDetails.eventName}</TableCell>
                <TableCell>{booking.customerName}</TableCell>
                <TableCell>{booking.phone}</TableCell>
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
                <TableCell>
                  <IconButton
                    onClick={() => handleDeleteClick(booking)}
                    color="error"
                    size="small"
                    title="Delete booking"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteClose}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the booking with reference number{' '}
            {deleteDialog.booking?.referenceNumber}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
