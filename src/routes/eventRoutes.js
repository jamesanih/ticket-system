const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/auth');
const { validateInitializeEvent,validateBookTicket,validateCancelBooking,validateGetEventStatus, validate } = require('../middleware/inputValidation');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Initialize a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - totalTickets
 *               - name
 *               - description
 *               - startDate
 *               - endDate
 *             properties:
 *               totalTickets:
 *                 type: integer
 *                 minimum: 1
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       422:
 *         description: Validation error
 */
router.post('/', authMiddleware, validateInitializeEvent, validate, eventController.initializeEvent);

/**
 * @swagger
 * /api/events/book:
 *   post:
 *     summary: Book tickets for an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *               - numberOfTickets
 *             properties:
 *               eventId:
 *                 type: integer
 *               numberOfTickets:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Invalid input or not enough tickets available
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Event not found
 */
router.post('/book', authMiddleware, validateBookTicket, validate, eventController.bookTicket);

/**
 * @swagger
 * /api/events/cancel:
 *   post:
 *     summary: Cancel a booking
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *             properties:
 *               bookingId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       400:
 *         description: Invalid input or booking already cancelled
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Booking not found
 */
router.post('/cancel', authMiddleware, validateCancelBooking, validate, eventController.cancelBooking);

/**
 * @swagger
 * /api/events/{eventId}/status:
 *   get:
 *     summary: Get event status
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event status retrieved successfully
 *       404:
 *         description: Event not found
 */
router.get('/:eventId/status', validateGetEventStatus, validate, eventController.getEventStatus);

module.exports = router;