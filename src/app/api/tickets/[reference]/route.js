import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(request, { params }) {
  try {
    const { reference } = params;
    
    // Read bookings data
    const bookingsPath = path.join(process.cwd(), 'src', 'data', 'bookings.json');
    const bookingsData = JSON.parse(await fs.readFile(bookingsPath, 'utf8'));
    
    // Find the booking
    const booking = bookingsData.bookings.find(b => b.referenceNumber === reference);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Generate QR code for the reference number
    const qrCodeDataURL = await QRCode.toDataURL(booking.referenceNumber);

    // Create ticket HTML
    const ticketHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Theatre Ticket - ${booking.referenceNumber}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background: #f5f5f5;
            }
            .ticket {
              background: white;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #145da0;
              padding-bottom: 20px;
              margin-bottom: 20px;
            }
            .event-name {
              color: #145da0;
              font-size: 24px;
              font-weight: bold;
              margin: 10px 0;
            }
            .details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 20px;
            }
            .qr-code {
              text-align: center;
              margin: 20px 0;
            }
            .qr-code img {
              max-width: 200px;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 14px;
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
            .detail-item {
              margin: 10px 0;
            }
            .detail-label {
              color: #666;
              font-size: 14px;
            }
            .detail-value {
              color: #145da0;
              font-weight: bold;
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <h1 style="margin:0;color:#145da0;">Theatre Ticket</h1>
              <div class="event-name">${booking.eventDetails.eventName}</div>
            </div>
            
            <div class="details">
              <div>
                <div class="detail-item">
                  <div class="detail-label">Reference Number</div>
                  <div class="detail-value">${booking.referenceNumber}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Customer Name</div>
                  <div class="detail-value">${booking.customerName}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Phone</div>
                  <div class="detail-value">${booking.phone}</div>
                </div>
              </div>
              <div>
                <div class="detail-item">
                  <div class="detail-label">Date & Time</div>
                  <div class="detail-value">${booking.eventDetails.date} at ${booking.eventDetails.time}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Venue</div>
                  <div class="detail-value">${booking.eventDetails.hallName}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Seats</div>
                  <div class="detail-value">${booking.seats.join(', ')}</div>
                </div>
              </div>
            </div>

            <div class="qr-code">
              <img src="${qrCodeDataURL}" alt="Ticket QR Code">
              <div style="margin-top:10px;font-size:12px;color:#666;">
                Scan for verification
              </div>
            </div>

            <div class="footer">
              <p>Total Amount: $${booking.totalPrice}</p>
              <p>Please present this ticket at the entrance. Enjoy the show!</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Return the HTML with appropriate headers for downloading
    return new NextResponse(ticketHtml, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="ticket-${booking.referenceNumber}.html"`
      }
    });

  } catch (error) {
    console.error('Error generating ticket:', error);
    return NextResponse.json({ 
      error: 'Internal server error while generating ticket' 
    }, { status: 500 });
  }
}
