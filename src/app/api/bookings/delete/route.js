import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { referenceNumber, adminCredentials } = await request.json();
    
    // Verify admin credentials
    const adminCredentialsPath = path.join(process.cwd(), 'src', 'data', 'adminCredentials.json');
    const adminData = JSON.parse(await fs.readFile(adminCredentialsPath, 'utf8'));
    
    if (adminCredentials.username !== adminData.username || 
        adminCredentials.password !== adminData.password) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Read current bookings
    const bookingsPath = path.join(process.cwd(), 'src', 'data', 'bookings.json');
    const bookingsData = JSON.parse(await fs.readFile(bookingsPath, 'utf8'));
    
    // Find and remove the booking
    const bookingIndex = bookingsData.bookings.findIndex(
      booking => booking.referenceNumber === referenceNumber
    );
    
    if (bookingIndex === -1) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    // Remove the booking
    bookingsData.bookings.splice(bookingIndex, 1);
    
    // Write back to file
    await fs.writeFile(bookingsPath, JSON.stringify(bookingsData, null, 2));
    
    return NextResponse.json({ 
      message: 'Booking deleted successfully',
      referenceNumber 
    });
    
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ 
      error: 'Internal server error while deleting booking' 
    }, { status: 500 });
  }
}
