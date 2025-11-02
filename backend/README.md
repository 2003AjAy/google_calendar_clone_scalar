# Calendar Backend API

Backend API for the Calendar application built with Express.js, TypeScript, Drizzle ORM, and Neon PostgreSQL.

## Features

- RESTful API for calendar events
- TypeScript for type safety
- Drizzle ORM for database operations
- Neon PostgreSQL database
- CORS enabled for frontend integration

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Neon PostgreSQL account (or any PostgreSQL database)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Update the `.env` file with your database credentials:

```env
DATABASE_URL=postgresql://username:password@host/database
PORT=3000
```

### 3. Set up Neon Database

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Copy the connection string
4. Paste it in your `.env` file as `DATABASE_URL`

### 4. Generate and Push Database Schema

```bash
# Generate migration files
npm run db:generate

# Push schema to database
npm run db:push
```

### 5. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get a single event by ID
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event

### Health Check

- `GET /health` - Check API status

## API Request Examples

### Create Event

```bash
POST /api/events
Content-Type: application/json

{
  "title": "Team Meeting",
  "start": "2025-11-03T10:00:00Z",
  "end": "2025-11-03T11:00:00Z",
  "description": "Weekly team sync",
  "color": "bg-blue-500 text-white",
  "allDay": false
}
```

### Update Event

```bash
PUT /api/events/:id
Content-Type: application/json

{
  "title": "Updated Team Meeting",
  "start": "2025-11-03T14:00:00Z",
  "end": "2025-11-03T15:00:00Z",
  "description": "Rescheduled team sync",
  "color": "bg-red-500 text-white",
  "allDay": false
}
```

## Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── eventController.ts    # Event CRUD operations
│   ├── db/
│   │   ├── connection.ts          # Database connection
│   │   └── schema.ts              # Drizzle schema
│   ├── routes/
│   │   └── eventRoutes.ts         # API routes
│   └── index.ts                   # Express app entry point
├── drizzle.config.ts              # Drizzle configuration
├── nodemon.json                   # Nodemon configuration
├── package.json
├── tsconfig.json
└── .env.example
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:generate` - Generate migration files
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Database Schema

### Events Table

| Column      | Type      | Description                    |
|-------------|-----------|--------------------------------|
| id          | UUID      | Primary key                    |
| title       | TEXT      | Event title (required)         |
| start       | TIMESTAMP | Start date/time (required)     |
| end         | TIMESTAMP | End date/time (required)       |
| description | TEXT      | Event description (optional)   |
| color       | TEXT      | Event color class              |
| allDay      | BOOLEAN   | All-day event flag             |
| createdAt   | TIMESTAMP | Creation timestamp             |
| updatedAt   | TIMESTAMP | Last update timestamp          |

## Development

### Using Drizzle Studio

To explore and manage your database with a GUI:

```bash
npm run db:studio
```

This will open Drizzle Studio in your browser at `https://local.drizzle.studio`

## Connecting to Frontend

Update your frontend to point to the backend API:

```typescript
const API_URL = 'http://localhost:3000/api/events';
```

## Troubleshooting

### Database Connection Issues

- Verify your `DATABASE_URL` in `.env`
- Ensure your Neon database is active
- Check network connectivity

### Port Already in Use

Change the `PORT` in your `.env` file:

```env
PORT=3001
```

## License

ISC
