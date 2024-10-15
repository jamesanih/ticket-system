const { Event, Booking, sequelize } = require('../models');
const eventController = require('../controllers/eventController');

// Mock the models and sequelize
jest.mock('../models', () => ({
  Event: {
    findByPk: jest.fn(),
    create: jest.fn(),
  },
  Booking: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
  sequelize: {
    transaction: jest.fn(() => ({
      commit: jest.fn(),
      rollback: jest.fn(),
      LOCK: { UPDATE: 'UPDATE' },
    })),
  },
}));

describe('Event Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { id: 1 }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('initializeEvent', () => {
    it('should create a new event successfully', async () => {
      req.body = {
        totalTickets: 100,
        name: 'Test Event',
        description: 'Test Description',
        startDate: '2023-01-01',
        endDate: '2023-01-02'
      };

      Event.create.mockResolvedValue({ id: 1, ...req.body });

      await eventController.initializeEvent(req, res);

      expect(Event.create).toHaveBeenCalledWith({
        totalTickets: 100,
        availableTickets: 100,
        name: 'Test Event',
        description: 'Test Description',
        startDate: '2023-01-01',
        endDate: '2023-01-02'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(req.body));
    });
  });

  describe('bookTicket', () => {
    it('should book tickets successfully', async () => {
      req.body = {
        eventId: 1,
        numberOfTickets: 2
      };

      const mockEvent = {
        id: 1,
        availableTickets: 10,
        save: jest.fn()
      };

      const mockBooking = {
        id: 1,
        userId: 1,
        eventId: 1,
        numberOfTickets: 2,
        status: 'booked'
      };

      Event.findByPk.mockResolvedValue(mockEvent);
      Booking.create.mockResolvedValue(mockBooking);

      await eventController.bookTicket(req, res);

      expect(Event.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
      expect(Booking.create).toHaveBeenCalledWith({
        userId: 1,
        eventId: 1,
        numberOfTickets: 2,
        status: 'booked'
      }, expect.any(Object));
      expect(mockEvent.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockBooking);
    });
  });

  describe('cancelBooking', () => {
    it('should cancel a booking successfully', async () => {
      req.body = {
        bookingId: 1
      };

      const mockBooking = {
        id: 1,
        userId: 1,
        eventId: 1,
        numberOfTickets: 2,
        status: 'booked',
        update: jest.fn(),
        Event: {
          id: 1,
          availableTickets: 8,
          save: jest.fn()
        }
      };

      Booking.findOne.mockResolvedValue(mockBooking);

      await eventController.cancelBooking(req, res);

      expect(Booking.findOne).toHaveBeenCalledWith(expect.any(Object));
      expect(mockBooking.update).toHaveBeenCalledWith({ status: 'cancelled' }, expect.any(Object));
      expect(mockBooking.Event.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Booking cancelled successfully' });
    });
  });

  describe('getEventStatus', () => {
    it('should return event status successfully', async () => {
      req.params = {
        eventId: 1
      };

      const mockEvent = {
        id: 1,
        totalTickets: 100,
        availableTickets: 90,
        Bookings: [
          { status: 'booked' },
          { status: 'waiting' },
          { status: 'waiting' }
        ]
      };

      Event.findByPk.mockResolvedValue(mockEvent);

      await eventController.getEventStatus(req, res);

      expect(Event.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
      expect(res.json).toHaveBeenCalledWith({
        eventId: 1,
        totalTickets: 100,
        availableTickets: 90,
        waitingListCount: 2
      });
    });
  });
});