const { body, param, validationResult } = require('express-validator');

exports.validateInitializeEvent = [
  body('totalTickets').isInt({ min: 1 }).withMessage('Total tickets must be a positive integer'),
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('startDate').isISO8601().toDate().withMessage('Start date must be a valid date'),
  body('endDate').isISO8601().toDate().withMessage('End date must be a valid date'),
];

exports.validateBookTicket = [
  body('eventId').isInt({ min: 1 }).withMessage('Event ID must be a positive integer'),
  body('userId').isInt({ min: 1 }).withMessage('User ID must be a positive integer'),
];

exports.validateCancelBooking = [
  body('bookingId').isInt({ min: 1 }).withMessage('Booking ID must be a positive integer'),
];

exports.validateGetEventStatus = [
  param('eventId').isInt({ min: 1 }).withMessage('Event ID must be a positive integer'),
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};