const Joi = require('joi');

// Validation schema for creating portfolio project
const createPortfolioSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title must not exceed 255 characters',
      'any.required': 'Title is required'
    }),

  description: Joi.string()
    .max(5000)
    .allow('', null)
    .messages({
      'string.max': 'Description must not exceed 5000 characters'
    }),

  project_type: Joi.string()
    .valid('residential', 'commercial', 'industrial', 'renovation', 'other')
    .required()
    .messages({
      'any.only': 'Project type must be one of: residential, commercial, industrial, renovation, other',
      'any.required': 'Project type is required'
    }),

  location: Joi.string()
    .max(255)
    .allow('', null)
    .messages({
      'string.max': 'Location must not exceed 255 characters'
    }),

  budget_range: Joi.string()
    .max(100)
    .allow('', null)
    .messages({
      'string.max': 'Budget range must not exceed 100 characters'
    }),

  completion_date: Joi.date()
    .max('now')
    .allow(null)
    .messages({
      'date.max': 'Completion date cannot be in the future'
    }),

  duration: Joi.string()
    .max(100)
    .allow('', null)
    .messages({
      'string.max': 'Duration must not exceed 100 characters'
    }),

  cover_image: Joi.string()
    .max(500)
    .allow('', null),

  is_featured: Joi.boolean()
    .default(false),

  display_order: Joi.number()
    .integer()
    .min(0)
    .default(0),

  is_visible: Joi.boolean()
    .default(true)
});

// Validation schema for updating portfolio project
const updatePortfolioSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(255)
    .messages({
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title must not exceed 255 characters'
    }),

  description: Joi.string()
    .max(5000)
    .allow('', null)
    .messages({
      'string.max': 'Description must not exceed 5000 characters'
    }),

  project_type: Joi.string()
    .valid('residential', 'commercial', 'industrial', 'renovation', 'other')
    .messages({
      'any.only': 'Project type must be one of: residential, commercial, industrial, renovation, other'
    }),

  location: Joi.string()
    .max(255)
    .allow('', null),

  budget_range: Joi.string()
    .max(100)
    .allow('', null),

  completion_date: Joi.date()
    .max('now')
    .allow(null)
    .messages({
      'date.max': 'Completion date cannot be in the future'
    }),

  duration: Joi.string()
    .max(100)
    .allow('', null),

  cover_image: Joi.string()
    .max(500)
    .allow('', null),

  is_featured: Joi.boolean(),

  display_order: Joi.number()
    .integer()
    .min(0),

  is_visible: Joi.boolean()
}).min(1); // At least one field must be provided

// Validation schema for deleting image
const deleteImageSchema = Joi.object({
  imagePath: Joi.string()
    .required()
    .messages({
      'any.required': 'Image path is required'
    })
});

// Middleware to validate portfolio creation
const validateCreatePortfolio = (req, res, next) => {
  const { error } = createPortfolioSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message
    }));

    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

// Middleware to validate portfolio update
const validateUpdatePortfolio = (req, res, next) => {
  const { error } = updatePortfolioSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message
    }));

    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

// Middleware to validate delete image request
const validateDeleteImage = (req, res, next) => {
  const { error } = deleteImageSchema.validate(req.body, {
    abortEarly: false
  });

  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details[0].message
    });
  }

  next();
};

module.exports = {
  validateCreatePortfolio,
  validateUpdatePortfolio,
  validateDeleteImage
};
