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


3. Run database migrations:
   ```
   npx sequelize-cli db:migrate
   ```

4. Start the server:
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

# Event Ticket Booking System API Documentation

## Base URL
`http://localhost:3000/api`

## Endpoints

### 1. Initialize Event
- **URL:** `/initialize`
- **Method:** `POST`
- **Auth required:** Yes
- **Body:**
  ```json
  {
    "name": "Summer Music Festival",
    "totalTickets": 1000
  }
  ```
- **Success Response:**
  - **Code:** 201
  - **Content:** 
    ```json
    {
      "id": 1,
      "name": "Summer Music Festival",
      "totalTickets": 1000,
      "availableTickets": 1000
    }
    ```
- **Error Response:**
  - **Code:** 400
  - **Content:** `{ "error": "Event name is required" }`

### 2. Book Ticket
- **URL:** `/book`
- **Method:** `POST`
- **Auth required:** Yes
- **Body:**
  ```json
  {
    "eventId": 1,
    "userId": "user123"
  }
  ```
- **Success Response:**
  - **Code:** 201
  - **Content:** `{ "message": "Ticket booked successfully" }`
- **Alternative Response:**
  - **Code:** 202
  - **Content:** `{ "message": "Added to waiting list" }`
- **Error Response:**
  - **Code:** 400
  - **Content:** `{ "error": "Event not found" }`

### 3. Cancel Booking
- **URL:** `/cancel`
- **Method:** `POST`
- **Auth required:** Yes
- **Body:**
  ```json
  {
    "eventId": 1,
    "userId": "user123"
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:** `{ "message": "Booking cancelled successfully" }`
- **Error Response:**
  - **Code:** 400
  - **Content:** `{ "error": "Booking not found" }`

### 4. Get Event Status
- **URL:** `/status/:eventId`
- **Method:** `GET`
- **Auth required:** No
- **URL Params:** `eventId=[integer]`
- **Success Response:**
  - **Code:** 200
  - **Content:** 
    ```json
    {
      "availableTickets": 950,
      "waitingListCount": 0
    }
    ```
- **Error Response:**
  - **Code:** 400
  - **Content:** `{ "error": "Event not found" }`

## Error Responses
All endpoints may return the following error responses:
- **Code:** 400
- **Content:** `{ "errors": [{ "msg": "Error message" }] }`

- **Code:** 401
- **Content:** `{ "error": "Authentication required" }`

- **Code:** 500
- **Content:** `{ "error": "Internal server error" }`

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

