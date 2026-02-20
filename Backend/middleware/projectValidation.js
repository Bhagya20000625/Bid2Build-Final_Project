const Joi = require('joi');

// Validation schema for creating a project
const createProjectSchema = Joi.object({
  title: Joi.string().min(3).max(255).required().messages({
    'string.min': 'Project title must be at least 3 characters long',
    'string.max': 'Project title must not exceed 255 characters',
    'any.required': 'Project title is required'
  }),
  
  description: Joi.string().min(10).required().messages({
    'string.min': 'Project description must be at least 10 characters long',
    'any.required': 'Project description is required'
  }),
  
  location: Joi.string().min(3).max(255).required().messages({
    'string.min': 'Location must be at least 3 characters long',
    'string.max': 'Location must not exceed 255 characters',
    'any.required': 'Location is required'
  }),
  
  category: Joi.string().valid('residential', 'commercial', 'industrial', 'renovation', 'infrastructure').required().messages({
    'any.only': 'Category must be one of: residential, commercial, industrial, renovation, infrastructure',
    'any.required': 'Category is required'
  }),
  
  budget_range: Joi.string().valid('0-50k', '50k-100k', '100k-500k', '500k-1m', '1m+').required().messages({
    'any.only': 'Budget range must be one of: 0-50k, 50k-100k, 100k-500k, 500k-1m, 1m+',
    'any.required': 'Budget range is required'
  }),
  
  timeline: Joi.string().valid('1-3months', '3-6months', '6-12months', '12months+').required().messages({
    'any.only': 'Timeline must be one of: 1-3months, 3-6months, 6-12months, 12months+',
    'any.required': 'Timeline is required'
  }),
  
  needs_architect: Joi.boolean().default(false),

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

// Validation schema for updating a project
const updateProjectSchema = Joi.object({
  title: Joi.string().min(3).max(255).optional(),
  description: Joi.string().min(10).optional(),
  location: Joi.string().min(3).max(255).optional(),
  category: Joi.string().valid('residential', 'commercial', 'industrial', 'renovation', 'infrastructure').optional(),
  budget_range: Joi.string().valid('0-50k', '50k-100k', '100k-500k', '500k-1m', '1m+').optional(),
  timeline: Joi.string().valid('1-3months', '3-6months', '6-12months', '12months+').optional(),
  needs_architect: Joi.boolean().optional(),
  status: Joi.string().valid('draft', 'active', 'bidding_closed', 'in_progress', 'completed', 'cancelled').optional()
});

// Middleware to validate project creation
const validateProject = (req, res, next) => {
  const { error, value } = createProjectSchema.validate(req.body, { abortEarly: false });

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

// Middleware to validate project update
const validateProjectUpdate = (req, res, next) => {
  const { error, value } = updateProjectSchema.validate(req.body, { abortEarly: false });
  
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
  validateProject,
  validateProjectUpdate
};