import { body, param, validationResult } from 'express-validator';

// Middleware to check for validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation rules for each route
const initializeValidation = [
  body('name').notEmpty().withMessage('Event name is required'),
  body('totalTickets').isInt({ min: 1 }).withMessage('Total tickets must be a positive integer'),
  validate
];

const bookValidation = [
  body('eventId').isInt({ min: 1 }).withMessage('Valid event ID is required'),
  body('userId').notEmpty().withMessage('User ID is required'),
  validate
];

const cancelValidation = [
  body('eventId').isInt({ min: 1 }).withMessage('Valid event ID is required'),
  body('userId').notEmpty().withMessage('User ID is required'),
  validate
];

const statusValidation = [
  param('eventId').isInt({ min: 1 }).withMessage('Valid event ID is required'),
  validate
];

// Exporting the validation rules
export {
  initializeValidation,
  bookValidation,
  cancelValidation,
  statusValidation
};