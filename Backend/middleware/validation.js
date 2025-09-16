// Email validation function (matches frontend validation)
const validateEmail = (email) => {
  // Check total length
  if (email.length > 254) return false;
  
  // Check for spaces
  if (/\s/.test(email)) return false;
  
  // Check for exactly one @ symbol
  const atCount = (email.match(/@/g) || []).length;
  if (atCount !== 1) return false;
  
  const [localPart, domainPart] = email.split('@');
  
  // Check local part length and not empty
  if (localPart.length > 64 || localPart.length === 0) return false;
  
  // Check valid characters in local part
  if (!/^[a-zA-Z0-9._+-]+$/.test(localPart)) return false;
  
  // Check domain part
  if (!domainPart || domainPart.length === 0) return false;
  
  // Check domain contains at least one dot
  if (!domainPart.includes('.')) return false;
  
  // Check domain format
  if (!/^[a-zA-Z0-9.-]+$/.test(domainPart)) return false;
  
  return true;
};

// Password validation function (matches frontend validation)
const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('At least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('At least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('At least one lowercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('At least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('At least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

// Registration validation middleware
const validateRegistration = (req, res, next) => {
  const { email, firstName, lastName, phone, password, confirmPassword, userRole } = req.body;
  const errors = [];

  // Required fields validation
  if (!email) errors.push('Email is required');
  if (!firstName) errors.push('First name is required');
  if (!lastName) errors.push('Last name is required');
  if (!phone) errors.push('Phone is required');
  if (!password) errors.push('Password is required');
  if (!confirmPassword) errors.push('Confirm password is required');
  if (!userRole) errors.push('User role is required');

  // Email validation
  if (email && !validateEmail(email)) {
    errors.push('Invalid email format');
  }

  // Password validation
  if (password) {
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }
  }

  // Password confirmation
  if (password && confirmPassword && password !== confirmPassword) {
    errors.push('Passwords do not match');
  }

  // User role validation (convert to lowercase for database consistency)
  const validRoles = ['Customer', 'Constructor', 'Supplier', 'Architect'];
  if (userRole && !validRoles.includes(userRole)) {
    errors.push('Invalid user role');
  }

  // Name validation (letters, spaces, hyphens, apostrophes only)
  const nameRegex = /^[a-zA-Z\s\-\']+$/;
  if (firstName && !nameRegex.test(firstName)) {
    errors.push('First name contains invalid characters');
  }
  if (lastName && !nameRegex.test(lastName)) {
    errors.push('Last name contains invalid characters');
  }

  // Phone validation (basic)
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  if (phone && !phoneRegex.test(phone)) {
    errors.push('Invalid phone number format');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation failed', 
      errors: errors 
    });
  }

  next();
};

// Role-specific validation middleware
const validateRoleSpecificData = (req, res, next) => {
  const { userRole } = req.body;
  const errors = [];

  switch (userRole) {
    case 'Customer':
      // Customer validation is optional for location only
      break;
      
    case 'Constructor':
      if (!req.body.specialization) errors.push('Specialization is required for constructors');
      if (!req.body.licenseNumber) errors.push('License number is required for constructors');
      break;
      
    case 'Supplier':
      if (!req.body.businessName) errors.push('Business name is required for suppliers');
      if (!req.body.businessRegNumber) errors.push('Business registration number is required for suppliers');
      if (!req.body.serviceArea) errors.push('Service area is required for suppliers');
      break;
      
    case 'Architect':
      if (!req.body.specialization) errors.push('Specialization is required for architects');
      if (!req.body.licenseNumber) errors.push('License number is required for architects');
      break;
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Role-specific validation failed', 
      errors: errors 
    });
  }

  next();
};

module.exports = {
  validateEmail,
  validatePassword,
  validateRegistration,
  validateRoleSpecificData
};