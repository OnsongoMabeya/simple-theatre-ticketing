import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const theatreDataPath = path.join(process.cwd(), 'src', 'data', 'theatreData.json');
const bookingsDataPath = path.join(process.cwd(), 'src', 'data', 'bookings.json');

export async function POST(request) {
  try {
    const { bookingData, selectedSeats, hallId, eventId } = await request.json();

    // Read existing theatre data
    const theatreData = JSON.parse(await fs.readFile(theatreDataPath, 'utf8'));

    // Find the hall and event
    const hall = theatreData.halls.find(h => h.id === parseInt(hallId));
    if (!hall) {
      return NextResponse.json({ error: 'Hall not found' }, { status: 404 });
    }

    const event = hall.events.find(e => e.id === eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if seats are still available
    const unavailableSeats = selectedSeats.filter(seat => event.bookedSeats.includes(seat));
    if (unavailableSeats.length > 0) {
      return NextResponse.json({ 
        error: `Seats ${unavailableSeats.join(', ')} are no longer available` 
      }, { status: 400 });
    }

    // Update theatre data with new bookings
    event.bookedSeats = [...event.bookedSeats, ...selectedSeats];
    event.availableSeats = event.availableSeats - selectedSeats.length;

    // Read and update bookings.json
    let bookings;
    try {
      const bookingsContent = await fs.readFile(bookingsDataPath, 'utf8');
      bookings = JSON.parse(bookingsContent);
    } catch (error) {
      bookings = { bookings: [] };
    }

    // Add new booking
    bookings.bookings.push(bookingData);

    // Save both files
    await Promise.all([
      fs.writeFile(theatreDataPath, JSON.stringify(theatreData, null, 2)),
      fs.writeFile(bookingsDataPath, JSON.stringify(bookings, null, 2))
    ]);

    return NextResponse.json({ 
      success: true, 
      message: 'Booking successful',
      referenceNumber: bookingData.referenceNumber 
    });

  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ 
      error: 'Internal server error during booking process' 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const theatreData = JSON.parse(await fs.readFile(theatreDataPath, 'utf8'));
    return NextResponse.json(theatreData);
  } catch (error) {
    console.error('Error fetching theatre data:', error);
    return NextResponse.json({ 
      error: 'Internal server error while fetching theatre data' 
    }, { status: 500 });
  }
}
