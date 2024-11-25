import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const { bookingId } = await request.json();
    
    // Read the current bookings
    const bookingsPath = path.join(process.cwd(), 'src', 'data', 'bookings.json');
    const bookingsData = await fs.readFile(bookingsPath, 'utf8');
    const data = JSON.parse(bookingsData);

    // Find and update the booking
    const updatedBookings = data.bookings.map(booking => {
      if (booking.referenceNumber === bookingId) {
        return { ...booking, checkedIn: true };
      }
      return booking;
    });

    // Write back to the file
    await fs.writeFile(
      bookingsPath, 
      JSON.stringify({ ...data, bookings: updatedBookings }, null, 2)
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
