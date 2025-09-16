const Joi = require('joi');

// Validation schema for creating a bid
const createBidSchema = Joi.object({
  project_id: Joi.number().integer().positive().optional().messages({
    'number.base': 'Project ID must be a number',
    'number.positive': 'Project ID must be positive'
  }),
  
  material_request_id: Joi.number().integer().positive().optional().messages({
    'number.base': 'Material request ID must be a number',
    'number.positive': 'Material request ID must be positive'
  }),
  
  bidder_user_id: Joi.number().integer().positive().required().messages({
    'number.base': 'Bidder user ID must be a number',
    'number.positive': 'Bidder user ID must be positive',
    'any.required': 'Bidder user ID is required'
  }),
  
  bidder_role: Joi.string().valid('constructor', 'supplier', 'architect').required().messages({
    'any.only': 'Bidder role must be one of: constructor, supplier, architect',
    'any.required': 'Bidder role is required'
  }),
  
  bid_amount: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Bid amount must be a number',
    'number.positive': 'Bid amount must be positive',
    'any.required': 'Bid amount is required'
  }),
  
  proposed_timeline: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Proposed timeline must be at least 3 characters long',
    'string.max': 'Proposed timeline must not exceed 100 characters',
    'any.required': 'Proposed timeline is required'
  }),
  
  description: Joi.string().min(10).required().messages({
    'string.min': 'Description must be at least 10 characters long',
    'any.required': 'Description is required'
  })
}).xor('project_id', 'material_request_id').messages({
  'object.xor': 'Bid must be for either a project or a material request, but not both'
});

// Validation schema for updating bid status
const updateBidStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'accepted', 'rejected').required().messages({
    'any.only': 'Status must be one of: pending, accepted, rejected',
    'any.required': 'Status is required'
  })
});

// Middleware to validate bid creation
const validateBid = (req, res, next) => {
  const { error, value } = createBidSchema.validate(req.body, { abortEarly: false });
  
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

// Middleware to validate bid status update
const validateBidStatusUpdate = (req, res, next) => {
  const { error, value } = updateBidStatusSchema.validate(req.body, { abortEarly: false });
  
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
  validateBid,
  validateBidStatusUpdate
};