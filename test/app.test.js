const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/db');

beforeEach(async () => {
    await sequelize.sync({ force: true });
});

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Event Ticket Booking System API', () => {
  let eventId;

  describe('Initialize Event', () => {
    it('should create a new event', async () => {
      const response = await request(app)
        .post('/api/initialize')
        .send({ name: 'Test Event', totalTickets: 100 });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test Event');
      expect(response.body.totalTickets).toBe(100);
      expect(response.body.availableTickets).toBe(100);

      eventId = response.body.id;
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/api/initialize')
        .send({ totalTickets: 100 });

      expect(response.statusCode).toBe(400);
      expect(response.body.errors[0].msg).toBe('Event name is required');
    });
  });

  describe('Book Ticket', () => {
    it('should book a ticket successfully', async () => {
      const response = await request(app)
        .post('/api/book')
        .send({ eventId, userId: 'user1' });

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe('Ticket booked successfully');
    });

    it('should add to waiting list when event is full', async () => {
      // Book all available tickets
      for (let i = 0; i < 98; i++) {
        await request(app)
          .post('/api/book')
          .send({ eventId, userId: `user${i + 2}` });
      }

      const response = await request(app)
        .post('/api/book')
        .send({ eventId, userId: 'userWaiting' });

      expect(response.statusCode).toBe(202);
      expect(response.body.message).toBe('Added to waiting list');
    });

    it('should return 400 if event does not exist', async () => {
      const response = await request(app)
        .post('/api/book')
        .send({ eventId: 9999, userId: 'user1' });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Event not found');
    });
  });

  describe('Cancel Booking', () => {
    it('should cancel a booking successfully', async () => {
      const response = await request(app)
        .post('/api/cancel')
        .send({ eventId, userId: 'user1' });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Booking cancelled successfully');
    });

    it('should assign ticket to waiting list user after cancellation', async () => {
      const responseCancel = await request(app)
        .post('/api/cancel')
        .send({ eventId, userId: 'user2' });

      expect(responseCancel.statusCode).toBe(200);

      const responseStatus = await request(app)
        .get(`/api/status/${eventId}`);

      expect(responseStatus.body.availableTickets).toBe(0);
      expect(responseStatus.body.waitingListCount).toBe(0);
    });

    it('should return 400 if booking does not exist', async () => {
      const response = await request(app)
        .post('/api/cancel')
        .send({ eventId, userId: 'nonexistentuser' });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Booking not found');
    });
  });

  describe('Get Event Status', () => {
    it('should return correct event status', async () => {
      const response = await request(app)
        .get(`/api/status/${eventId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('availableTickets');
      expect(response.body).toHaveProperty('waitingListCount');
    });

    it('should return 400 if event does not exist', async () => {
      const response = await request(app)
        .get('/api/status/9999');

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Event not found');
    });
  });
});