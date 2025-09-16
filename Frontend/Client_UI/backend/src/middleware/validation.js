import Joi from 'joi';

// Validation middleware
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }
    
    req.validatedData = value;
    next();
  };
};

// Common validation schemas
export const schemas = {
  // Authentication schemas
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    first_name: Joi.string().min(2).max(100).required(),
    last_name: Joi.string().min(2).max(100).required(),
    user_role: Joi.string().valid('customer', 'constructor', 'supplier', 'architect').required(),
    phone: Joi.string().optional()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // Project schemas
  createProject: Joi.object({
    title: Joi.string().min(3).max(255).required(),
    description: Joi.string().min(10).required(),
    location: Joi.string().min(3).max(255).required(),
    category: Joi.string().valid('residential', 'commercial', 'industrial', 'renovation', 'infrastructure').required(),
    budget_range: Joi.string().valid('0-50k', '50k-100k', '100k-500k', '500k-1m', '1m+').required(),
    timeline: Joi.string().valid('1-3months', '3-6months', '6-12months', '12months+').required(),
    needs_architect: Joi.boolean().default(false),
    has_project_plans: Joi.boolean().default(false)
  }),

  updateProject: Joi.object({
    title: Joi.string().min(3).max(255).optional(),
    description: Joi.string().min(10).optional(),
    location: Joi.string().min(3).max(255).optional(),
    category: Joi.string().valid('residential', 'commercial', 'industrial', 'renovation', 'infrastructure').optional(),
    budget_range: Joi.string().valid('0-50k', '50k-100k', '100k-500k', '500k-1m', '1m+').optional(),
    timeline: Joi.string().valid('1-3months', '3-6months', '6-12months', '12months+').optional(),
    needs_architect: Joi.boolean().optional(),
    has_project_plans: Joi.boolean().optional(),
    status: Joi.string().valid('draft', 'active', 'bidding_closed', 'in_progress', 'completed', 'cancelled').optional()
  }),

  // Material request schemas
  createMaterialRequest: Joi.object({
    title: Joi.string().min(3).max(255).required(),
    category: Joi.string().valid('structural', 'concrete', 'electrical', 'plumbing', 'finishing').required(),
    description: Joi.string().min(10).required(),
    quantity: Joi.string().min(1).max(100).required(),
    deadline: Joi.date().min('now').required(),
    specifications: Joi.string().optional()
  }),

  // Bid schemas
  createBid: Joi.object({
    project_id: Joi.number().integer().positive().optional(),
    material_request_id: Joi.number().integer().positive().optional(),
    bid_amount: Joi.number().positive().precision(2).required(),
    proposed_timeline: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).required()
  }).xor('project_id', 'material_request_id'), // Must have one but not both

  // Message schemas
  sendMessage: Joi.object({
    recipient_id: Joi.number().integer().positive().required(),
    project_id: Joi.number().integer().positive().optional(),
    subject: Joi.string().max(255).optional(),
    message: Joi.string().min(1).required()
  })
};