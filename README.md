# Event Ticket Booking System

This is a Node.js application for an event ticket booking system, providing a RESTful API for managing events, bookings, and waiting lists. It includes basic authentication for sensitive operations and a logging system for tracking operations.

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/biolabalo/EventTicketBookingSystem.git
   cd EventTicketBookingSystem
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your PostgreSQL database and update the `.env` file with your database URL and JWT secret:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   JWT_SECRET=your-secret-key
   ```

4. Run database migrations:
   ```
   npx sequelize-cli db:migrate
   ```

5. Start the server:
   ```
   npm start
   ```

   For development with auto-restart:
   ```
   npm run dev
   ```

## Running Tests

To run the test suite:

```
npm test
```

## API Endpoints

All endpoints except `/api/status/:eventId` require authentication using a JWT token in the Authorization header.

- `POST /api/initialize`: Initialize a new event
  - Request body: `{ "name": "Event Name", "totalTickets": 100 }`
  - Response: Created event object

- `POST /api/book`: Book a ticket
  - Request body: `{ "eventId": 1 }`
  - Response: Booking confirmation or waiting list addition

- `POST /api/cancel`: Cancel a booking
  - Request body: `{ "eventId": 1 }`
  - Response: Cancellation confirmation

- `GET /api/status/:eventId`: Get event status (public)
  - Response: `{ "availableTickets": 50, "waitingListCount": 10 }`

## Authentication

To authenticate requests, include a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

To generate a token for testing, you can use the `generateToken` function in `src/utils/jwt.js`.

## Logging

Logs are stored in the `logs` directory:
- `error.log`: Contains error logs
- `combined.log`: Contains all logs (info, warn, error)

In development, logs are also output to the console.

## Error Handling

The application includes centralized error handling. All errors are logged and a generic error message is sent to the client to avoid exposing sensitive information.

## Concurrency Handling

The application uses database transactions and row-level locking to handle concurrency issues, ensuring that ticket bookings and cancellations are processed correctly even under high load.

## Future Improvements

- Implement user registration and login system
- Add rate limiting to prevent abuse

