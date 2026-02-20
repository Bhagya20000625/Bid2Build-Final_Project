const Joi = require('joi');

// Validation schema for creating a material request
const createMaterialRequestSchema = Joi.object({
  title: Joi.string().min(3).max(255).required().messages({
    'string.min': 'Material request title must be at least 3 characters long',
    'string.max': 'Material request title must not exceed 255 characters',
    'any.required': 'Material request title is required'
  }),
  
  category: Joi.string().valid('structural', 'concrete', 'electrical', 'plumbing', 'finishing').required().messages({
    'any.only': 'Category must be one of: structural, concrete, electrical, plumbing, finishing',
    'any.required': 'Category is required'
  }),
  
  description: Joi.string().min(10).required().messages({
    'string.min': 'Description must be at least 10 characters long',
    'any.required': 'Description is required'
  }),
  
  quantity: Joi.string().min(1).max(100).required().messages({
    'string.min': 'Quantity must be specified',
    'string.max': 'Quantity description must not exceed 100 characters',
    'any.required': 'Quantity is required'
  }),
  
  deadline: Joi.date().min('now').required().messages({
    'date.min': 'Deadline must be in the future',
    'any.required': 'Deadline is required'
  }),
  
  specifications: Joi.string().optional().allow(''),

  // Accept both customer_id and user_id for backwards compatibility
  user_id: Joi.number().integer().positive().optional().messages({
    'number.base': 'User ID must be a number',
    'number.positive': 'User ID must be positive'
  }),
  customer_id: Joi.number().integer().positive().optional().messages({
    'number.base': 'Customer ID must be a number',
    'number.positive': 'Customer ID must be positive'
  })
});

// Validation schema for updating a material request
const updateMaterialRequestSchema = Joi.object({
  title: Joi.string().min(3).max(255).optional(),
  category: Joi.string().valid('structural', 'concrete', 'electrical', 'plumbing', 'finishing').optional(),
  description: Joi.string().min(10).optional(),
  quantity: Joi.string().min(1).max(100).optional(),
  deadline: Joi.date().min('now').optional(),
  specifications: Joi.string().optional().allow(''),
  status: Joi.string().valid('active', 'awarded', 'completed', 'cancelled').optional()
});

// Middleware to validate material request creation
const validateMaterialRequest = (req, res, next) => {
  const { error, value } = createMaterialRequestSchema.validate(req.body, { abortEarly: false });

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

  // Handle backwards compatibility: convert customer_id to user_id
  if (value.customer_id && !value.user_id) {
    value.user_id = value.customer_id;
    delete value.customer_id;
  }

  // Ensure user_id is provided
  if (!value.user_id) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: [{ field: 'user_id', message: 'User ID is required' }]
    });
  }

  req.validatedData = value;
  next();
};

// Middleware to validate material request update
const validateMaterialRequestUpdate = (req, res, next) => {
  const { error, value } = updateMaterialRequestSchema.validate(req.body, { abortEarly: false });
  
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
  validateMaterialRequest,
  validateMaterialRequestUpdate
};