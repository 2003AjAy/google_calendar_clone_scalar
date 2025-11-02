# Calendar Application - Complete Setup Guide

## Prerequisites

1. Node.js (v18 or higher)
2. npm 
3. Neon PostgreSQL account (free tier available)

## Backend Setup

### 1. Navigate to Backend Directory

```powershell
cd C:\Users\Dell\Downloads\Calendar_clone\backend
```

### 2. Install Dependencies

```powershell
npm install
```

### 3. Set Up Neon Database

1. Go to [https://console.neon.tech/](https://console.neon.tech/)
2. Sign up or log in
3. Create a new project (e.g., "calendar-app")
4. Copy the connection string (it looks like: `postgresql://username:password@host/database`)

### 4. Configure Environment Variables

Create a `.env` file in the backend directory:

```powershell
# Create .env from example
Copy-Item .env.example .env

# Edit .env and add your database URL
notepad .env
```

Update the `.env` file with your Neon connection string:

```env
DATABASE_URL=your_neon_connection_string_here
PORT=3000
```

### 5. Push Database Schema

```powershell
npm run db:push
```

### 6. Start Backend Server

```powershell
npm run dev
```

You should see:
```
🚀 Server is running on port 3000
📅 Calendar API: http://localhost:3000/api/events
💚 Health check: http://localhost:3000/health
```

## Frontend Setup

### 1. Open a New Terminal

Keep the backend running, and open a new PowerShell terminal.

### 2. Navigate to Frontend Directory

```powershell
cd C:\Users\Dell\Downloads\Calendar_clone\frontend
```

### 3. Install Dependencies (if not already done)

```powershell
npm install
```

### 4. Start Frontend Development Server

```powershell
npm run dev
```

The frontend should start on `http://localhost:5173` (or another port if 5173 is in use).

## Testing the Integration

### 1. Test Backend API

Open your browser and go to:
- `http://localhost:3000/health` - Should show `{"status":"ok","message":"Calendar API is running"}`
- `http://localhost:3000/api/events` - Should show an empty array `[]` initially

### 2. Test Frontend

1. Open `http://localhost:5173` in your browser
2. You should see the calendar interface
3. Click the "Create" button to add a new event
4. Fill in the event details and click "Save"
5. The event should now appear on the calendar and be saved in the database

### 3. Verify Database Storage

You can verify events are being saved by:

**Option 1: Using Drizzle Studio**
```powershell
cd C:\Users\Dell\Downloads\Calendar_clone\backend
npm run db:studio
```
This opens a GUI to view your database at `https://local.drizzle.studio`

**Option 2: Using Neon Console**
- Go to your Neon project in the browser
- Navigate to "SQL Editor"
- Run: `SELECT * FROM events;`

## API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events |
| GET | `/api/events/:id` | Get single event |
| POST | `/api/events` | Create new event |
| PUT | `/api/events/:id` | Update event |
| DELETE | `/api/events/:id` | Delete event |
| GET | `/health` | Health check |

## Troubleshooting

### Backend Issues

**"DATABASE_URL is not set"**
- Make sure you created the `.env` file
- Verify the database URL is correct

**"Failed to connect to database"**
- Check your internet connection
- Verify your Neon database is active
- Make sure the connection string is correct

**Port 3000 already in use**
- Change the PORT in `.env` to another port (e.g., 3001)
- Update the API_URL in `frontend/src/services/api.ts` accordingly

### Frontend Issues

**"Failed to load events"**
- Make sure the backend is running
- Check that the backend is on port 3000
- Open browser console (F12) to see error details
- Verify CORS is enabled in the backend (it should be by default)

**Events not showing after creation**
- Check browser console for errors
- Verify backend received the request (check backend terminal logs)
- Try refreshing the page

## Project Structure

```
Calendar_clone/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── eventController.ts
│   │   ├── db/
│   │   │   ├── connection.ts
│   │   │   └── schema.ts
│   │   ├── routes/
│   │   │   └── eventRoutes.ts
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── services/
    │   │   └── api.ts
    │   ├── types/
    │   └── App.tsx
    └── package.json
```

## Development Workflow

1. **Backend**: Running on `http://localhost:3000`
2. **Frontend**: Running on `http://localhost:5173`
3. Both should be running simultaneously
4. Changes to frontend code will hot-reload automatically
5. Changes to backend code will restart the server automatically (via nodemon)

## Next Steps

- Add user authentication
- Implement event categories
- Add recurring events
- Export events to iCal format
- Add event reminders/notifications
- Implement search functionality

## License

ISC
