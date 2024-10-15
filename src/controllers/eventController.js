const { Event, Booking, sequelize, User } = require('../models');

exports.initializeEvent = async (req, res) => {
  try {
    const { totalTickets, name, description, startDate, endDate } = req.body;

    const event = await Event.create({
      totalTickets,
      availableTickets: totalTickets,
      name,
      description,
      startDate,
      endDate,
    });

    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.bookTicket = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { eventId, numberOfTickets } = req.body;
    const userId = req.user.id;

    if (!eventId || !numberOfTickets || numberOfTickets <= 0) {
      await t.rollback();
      return res.status(400).json({ error: 'Invalid input' });
    }

    const event = await Event.findByPk(eventId, { 
      lock: t.LOCK.UPDATE,
      transaction: t 
    });

    if (!event) {
      await t.rollback();
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.availableTickets < numberOfTickets) {
      await t.rollback();
      return res.status(400).json({ error: 'Not enough tickets available' });
    }

    const booking = await Booking.create({
      userId,
      eventId,
      numberOfTickets,
      status: 'booked'
    }, { transaction: t });

    event.availableTickets -= numberOfTickets;
    await event.save({ transaction: t });

    await t.commit();
    res.status(201).json(booking);
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.cancelBooking = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { bookingId } = req.body;
    const userId = req.user.id;

    if (!bookingId) {
      await t.rollback();
      return res.status(400).json({ error: 'Missing bookingId' });
    }

    const booking = await Booking.findOne({
      where: { id: bookingId, userId },
      include: [Event],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!booking) {
      await t.rollback();
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      await t.rollback();
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    await booking.update({ status: 'cancelled' }, { transaction: t });

    booking.Event.availableTickets += booking.numberOfTickets;
    await booking.Event.save({ transaction: t });

    // Check for waiting list bookings
    const nextWaitingBooking = await Booking.findOne({
      where: { eventId: booking.Event.id, status: 'waiting' },
      order: [['createdAt', 'ASC']],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (nextWaitingBooking && nextWaitingBooking.numberOfTickets <= booking.Event.availableTickets) {
      await nextWaitingBooking.update({ status: 'booked' }, { transaction: t });
      booking.Event.availableTickets -= nextWaitingBooking.numberOfTickets;
      await booking.Event.save({ transaction: t });
    }

    await t.commit();
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getEventStatus = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId, {
      include: [
        {
          model: Booking,
          attributes: ['status'],
        },
      ],
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const waitingListCount = event.Bookings.filter(
      (booking) => booking.status === 'waiting'
    ).length;

    res.json({
      eventId: event.id,
      totalTickets: event.totalTickets,
      availableTickets: event.availableTickets,
      waitingListCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};