# Başkent Mezunlar Platformu

## Overview

This is a full-stack alumni platform for Başkent University ("Başkent Mezunlar Platformu" / BUOBS). The application connects university alumni, allowing them to network, search for other alumni, browse job postings, view alumni locations on an interactive map, and participate in a gamified points/rewards system. The platform includes both user-facing features and an admin dashboard for managing announcements and system logs.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite (using rolldown-vite)
- **Routing**: React Router DOM v7 for client-side navigation
- **State Management**: React Context API (AuthContext for authentication state)
- **HTTP Client**: Axios for API communication
- **Charts**: Recharts for data visualization in admin dashboard
- **Maps**: Leaflet with React-Leaflet for interactive alumni location maps
- **Icons**: React Icons library

**Key Frontend Pages**:
- `AuthPage` - User login/registration with carousel background
- `AdminAuthPage` - Separate admin authentication
- `DashboardPage` - Main user dashboard with sidebar navigation
- `AdminDashboardPage` - Admin panel with analytics and management tools
- `ProfilePage` - User profile management
- `AlumniSearchPage` - Search and filter alumni directory
- `MapPage` - Interactive map showing alumni locations globally
- `HomePage` - Gamified homepage with daily tasks and rewards
- `ShopPage` - Points-based reward shop

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript with ES Modules
- **Database**: PostgreSQL via `pg` driver
- **Authentication**: JWT tokens with bcryptjs for password hashing
- **API Structure**: RESTful API with route-based organization

**Backend Routes**:
- `/api/auth` - Authentication (login, register)
- `/api/users` - User profile management (protected routes)
- `/health` - Health check endpoint
- `/api/db-test` - Database connection test

### Data Storage
- **Primary Database**: PostgreSQL
- **Local Storage**: Used for client-side caching of user preferences, profiles, and announcements
- **Session Management**: JWT tokens stored in localStorage

### Authentication Flow
1. User submits credentials to `/api/auth/login` or `/api/auth/register`
2. Backend validates credentials, creates JWT token
3. Frontend stores token in localStorage
4. Protected routes use `authMiddleware` to verify JWT
5. Admin users have separate login flow with `isAdmin` flag

### Gamification System
The platform includes a points-based gamification system:
- Daily login streaks with weekly tracking
- Points earned through platform activities
- Virtual shop with avatars, badges, and medals
- User inventory tracking

## External Dependencies

### Frontend Dependencies
- **axios** - HTTP client for API requests
- **leaflet** / **react-leaflet** - Interactive mapping
- **recharts** - Chart components for admin analytics
- **react-router-dom** - Client-side routing
- **react-icons** - Icon library

### Backend Dependencies
- **express** - Web framework
- **pg** - PostgreSQL client
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Database
- PostgreSQL (configured via environment variables: PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE)

### Environment Configuration
The backend expects these environment variables:
- `PORT` - Server port (default: 5000)
- `FRONTEND_URL` - CORS allowed origin
- `JWT_SECRET` - Secret for JWT signing
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` - PostgreSQL connection

### Development Ports
- Frontend: Port 5000 (configured in vite.config.ts)
- Backend: Port 5000 (default, configurable)

Note: Both are configured for port 5000, which will cause conflicts. The frontend should run on a different port (e.g., 5173) in development.