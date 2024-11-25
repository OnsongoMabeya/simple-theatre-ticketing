import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { hallId, eventId } = await params;
    
    // Read theatre data
    const theatreDataPath = path.join(process.cwd(), 'src', 'data', 'theatreData.json');
    const theatreData = JSON.parse(await fs.readFile(theatreDataPath, 'utf8'));

    // Find the hall
    const hall = theatreData.halls.find(h => h.id === parseInt(hallId));
    if (!hall) {
      return NextResponse.json({ error: 'Hall not found' }, { status: 404 });
    }

    // Find the event
    const event = hall.events.find(e => e.id === eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      hall,
      event
    });
  } catch (error) {
    console.error('Error fetching event data:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch event data' 
    }, { status: 500 });
  }
}
