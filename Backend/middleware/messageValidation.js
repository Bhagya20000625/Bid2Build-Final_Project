const Joi = require('joi');

// Validation schema for sending a message
const sendMessageSchema = Joi.object({
  recipient_id: Joi.number().integer().positive().required().messages({
    'number.base': 'Recipient ID must be a number',
    'number.positive': 'Recipient ID must be positive',
    'any.required': 'Recipient ID is required'
  }),

  sender_id: Joi.number().integer().positive().required().messages({
    'number.base': 'Sender ID must be a number',
    'number.positive': 'Sender ID must be positive',
    'any.required': 'Sender ID is required'
  }),

  message: Joi.string().min(1).required().messages({
    'string.min': 'Message cannot be empty',
    'any.required': 'Message is required'
  })
}).unknown(true);

// Middleware to validate message sending
const validateMessage = (req, res, next) => {
  const { error, value } = sendMessageSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }
  
  req.validatedData = value;
  next();
};

module.exports = {
  validateMessage
};