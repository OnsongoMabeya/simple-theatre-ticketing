# Theatre Booking System

A modern, responsive web application for theatre event booking built with Next.js and Material-UI.

## Features

- 📅 Browse upcoming theatre events
- 🎭 Multiple venue halls with different seating configurations
- 🔍 Real-time search functionality
- 💺 Interactive seat selection
- 🎟️ Easy booking process
- 📱 Responsive design for all devices

## Venue Configuration

### Main Hall

- Capacity: 150 seats (10 rows × 15 seats)
- Perfect for large productions
- Alphabetic row labeling (A-J)

### Studio Theatre

- Capacity: 96 seats (8 rows × 12 seats)
- Ideal for intimate performances
- Alphabetic row labeling (A-H)

## Tech Stack

- **Framework**: Next.js 14
- **UI Library**: Material-UI (MUI)
- **Styling**: Emotion (MUI's styling solution)
- **State Management**: React Hooks
- **Data Storage**: Local JSON files (theatreData.json, bookings.json)

## Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd new-theatre-seating-app/my-app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```bash
my-app/
├── src/
│   ├── app/
│   │   ├── booking/
│   │   │   └── [hallId]/
│   │   │       └── [eventId]/
│   │   │           └── page.js    # Booking page with seat selection
│   │   ├── page.js                # Landing page with event listings
│   │   └── ThemeProvider.js       # MUI theme configuration
│   └── data/
│       ├── theatreData.json       # Event and venue data
│       └── bookings.json          # Booking records
├── public/
│   └── images/                    # Static images
└── package.json
```

## Features in Detail

### Landing Page

- Event cards with images and details
- Real-time search across event names, descriptions, and venues
- Price and date information
- Direct booking links

### Booking System

- Interactive seating chart
- Real-time seat availability
- Alphabetic row labeling (A, B, C, etc.)
- Visual seat status indicators
- Seat selection validation

### User Interface

- Responsive design
- Consistent color scheme (#145da0 primary color)
- Clear visual hierarchy
- Intuitive navigation

## Admin Features

The application includes an administrative interface for managing bookings and verifying customer attendance. Here's how to access and use the admin features:

### Accessing Admin Interface

1. **Hidden Login Trigger**
   - From the landing page, type the word "admin" (without quotes)
   - This will trigger the admin login modal
   - This hidden trigger ensures the admin interface remains discrete

2. **Admin Credentials**
   - Username: `admin`
   - Password: `admin`
   - Credentials can be modified in `src/data/adminCredentials.json`

### Admin Dashboard Features

1. **Booking Management**
   - View all theatre bookings in a centralized dashboard
   - See booking details including:
     * Reference numbers
     * Event information
     * Customer details
     * Seat assignments
     * Event dates and times
     * Check-in status

2. **Search and Filter**
   - Real-time search functionality
   - Filter bookings by:
     * Event name
     * Customer name
     * Seat numbers
     * Reference numbers

3. **Check-in System**
   - Mark attendees as checked-in
   - Visual indicators for check-in status
   - Prevent duplicate check-ins
   - Track attendance for each event

4. **Security Features**
   - Session-based authentication
   - Protected admin routes
   - Secure credential storage
   - Automatic logout on session expiry

### Security Considerations

- Admin credentials should be changed before deployment
- The admin interface is protected against unauthorized access
- Session tokens are cleared on logout
- API endpoints are protected against unauthorized requests

## Development

### Running Tests

```bash
npm run test
# or
yarn test
```

### Building for Production

```bash
npm run build
# or
yarn build
```

### Starting Production Server

```bash
npm run start
# or
yarn start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- Images sourced from Unsplash
- Material-UI for the component library
- Next.js team for the amazing framework
