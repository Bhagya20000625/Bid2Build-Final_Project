const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

const registerUser = async (req, res) => {
  console.log('=== REGISTRATION REQUEST STARTED ===');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  console.log('Request files:', req.files);
  let connection;
  
  try {
    // Get connection from pool
    connection = await pool.getConnection();
    
    // Start transaction
    await connection.beginTransaction();

    const {
      email,
      firstName,
      lastName,
      phone,
      password,
      userRole,
      // Customer fields
      location,
      // Constructor fields
      companyName,
      specialization,
      licenseNumber,
      portfolioUrl,
      // Supplier fields
      businessName,
      businessRegNumber,
      serviceArea,
      // Architect fields  
      designSoftware
    } = req.body;

    // Check if user already exists
    const [existingUser] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into users table (convert role to lowercase for database)
    console.log('About to insert user with data:', { email, firstName, lastName, phone, userRole: userRole.toLowerCase() });
    const userQuery = `INSERT INTO users (email, first_name, last_name, phone, password, user_role, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`;
    console.log('User SQL Query:', userQuery);
    const [userResult] = await connection.execute(
      userQuery,
      [email, firstName, lastName, phone, hashedPassword, userRole.toLowerCase()]
    );
    console.log('User insert successful, userId:', userResult.insertId);

    const userId = userResult.insertId;

    // Insert role-specific data
    switch (userRole.toLowerCase()) {
      case 'customer':
        await connection.execute(
          `INSERT INTO customers (user_id, location, created_at) VALUES (?, ?, NOW())`,
          [userId, location || 'Not specified']
        );
        break;

      case 'constructor':
        await connection.execute(
          `INSERT INTO constructors (user_id, company_name, specialization, license_number, portfolio_url, created_at)
           VALUES (?, ?, ?, ?, ?, NOW())`,
          [userId, companyName || null, specialization, licenseNumber, portfolioUrl || null]
        );
        break;

      case 'supplier':
        await connection.execute(
          `INSERT INTO suppliers (user_id, business_name, business_reg_number, service_area, created_at)
           VALUES (?, ?, ?, ?, NOW())`,
          [userId, businessName, businessRegNumber, serviceArea]
        );
        break;

      case 'architect':
        await connection.execute(
          `INSERT INTO architects (user_id, specialization, portfolio_url, design_software, license_number, created_at)
           VALUES (?, ?, ?, ?, ?, NOW())`,
          [userId, specialization, portfolioUrl || null, designSoftware || null, licenseNumber]
        );
        break;
    }

    // Handle file uploads and save file paths to database
    console.log('=== FILE UPLOAD DEBUG ===');
    console.log('req.files:', req.files);
    console.log('req.file:', req.file);
    
    // Convert array format to object format for easier handling
    const files = {};
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach(file => {
        files[file.fieldname] = [file];
      });
    } else if (req.files) {
      Object.assign(files, req.files);
    }
    
    console.log('Processed files:', Object.keys(files));

    // Handle customer document (saved in documents table)
    if (userRole.toLowerCase() === 'customer' && files.document) {
      const file = files.document[0];
      await connection.execute(
        `INSERT INTO documents (user_id, document_type, original_name, file_name, file_path, file_size, mime_type, uploaded_at)
         VALUES (?, 'customer_document', ?, ?, ?, ?, ?, NOW())`,
        [userId, file.originalname, file.filename, file.path, file.size, file.mimetype]
      );
      console.log('Customer document saved:', file.filename);
    }

    // Handle constructor files (saved in documents table)
    if (userRole.toLowerCase() === 'constructor') {
      if (files.businessCertificate) {
        const file = files.businessCertificate[0];
        await connection.execute(
          `INSERT INTO documents (user_id, document_type, original_name, file_name, file_path, file_size, mime_type) 
           VALUES (?, 'businessCertificate', ?, ?, ?, ?, ?)`,
          [userId, file.originalname, file.filename, file.path, file.size, file.mimetype]
        );
        console.log('Constructor business certificate saved:', file.filename);
      }
      if (files.relevantLicenses) {
        const file = files.relevantLicenses[0];
        await connection.execute(
          `INSERT INTO documents (user_id, document_type, original_name, file_name, file_path, file_size, mime_type) 
           VALUES (?, 'relevantLicenses', ?, ?, ?, ?, ?)`,
          [userId, file.originalname, file.filename, file.path, file.size, file.mimetype]
        );
        console.log('Constructor licenses saved:', file.filename);
      }
    }

    // Handle supplier files (saved in documents table)
    if (userRole.toLowerCase() === 'supplier') {
      if (files.registrationCertificate) {
        const file = files.registrationCertificate[0];
        await connection.execute(
          `INSERT INTO documents (user_id, document_type, original_name, file_name, file_path, file_size, mime_type) 
           VALUES (?, 'registrationCertificate', ?, ?, ?, ?, ?)`,
          [userId, file.originalname, file.filename, file.path, file.size, file.mimetype]
        );
        console.log('Supplier registration certificate saved:', file.filename);
      }
      if (files.catalogFile) {
        const file = files.catalogFile[0];
        await connection.execute(
          `INSERT INTO documents (user_id, document_type, original_name, file_name, file_path, file_size, mime_type) 
           VALUES (?, 'catalogFile', ?, ?, ?, ?, ?)`,
          [userId, file.originalname, file.filename, file.path, file.size, file.mimetype]
        );
        console.log('Supplier catalog saved:', file.filename);
      }
    }

    // Handle architect files (saved in documents table)
    if (userRole.toLowerCase() === 'architect' && files.professionalLicense) {
      const file = files.professionalLicense[0];
      await connection.execute(
        `INSERT INTO documents (user_id, document_type, original_name, file_name, file_path, file_size, mime_type) 
         VALUES (?, 'professionalLicense', ?, ?, ?, ?, ?)`,
        [userId, file.originalname, file.filename, file.path, file.size, file.mimetype]
      );
      console.log('Architect professional license saved:', file.filename);
    }

    // Commit transaction
    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        userId: userId,
        email: email,
        firstName: firstName,
        lastName: lastName,
        userRole: userRole
      }
    });

  } catch (error) {
    // Rollback transaction on error
    if (connection) {
      await connection.rollback();
    }
    
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    // Release connection
    if (connection) {
      connection.release();
    }
  }
};

// Get user by email (for login or verification)
const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const [users] = await pool.execute(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.user_role, u.is_verified, u.created_at
       FROM users u WHERE u.email = ?`,
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user profile with role-specific data
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get basic user data
    const [users] = await pool.execute(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.user_role, u.is_verified, u.created_at
       FROM users u WHERE u.id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];
    let roleSpecificData = {};

    // Get role-specific data
    switch (user.user_role) {
      case 'customer':
        const [customers] = await pool.execute(
          'SELECT id, location FROM customers WHERE user_id = ?',
          [userId]
        );
        roleSpecificData = { ...roleSpecificData, ...(customers[0] || {}) };
        break;

      case 'constructor':
        const [constructors] = await pool.execute(
          'SELECT company_name, specialization, license_number, portfolio_url FROM constructors WHERE user_id = ?',
          [userId]
        );
        roleSpecificData = { ...roleSpecificData, ...(constructors[0] || {}) };
        break;

      case 'supplier':
        const [suppliers] = await pool.execute(
          'SELECT business_name, business_reg_number, service_area FROM suppliers WHERE user_id = ?',
          [userId]
        );
        roleSpecificData = { ...roleSpecificData, ...(suppliers[0] || {}) };
        
        // Get materials
        const [materials] = await pool.execute(
          `SELECT sm.material FROM supplier_materials sm 
           JOIN suppliers s ON sm.supplier_id = s.id 
           WHERE s.user_id = ?`,
          [userId]
        );
        roleSpecificData.materials = materials.map(m => m.material);
        break;

      case 'architect':
        const [architects] = await pool.execute(
          'SELECT specialization, portfolio_url, design_software, license_number FROM architects WHERE user_id = ?',
          [userId]
        );
        roleSpecificData = { ...roleSpecificData, ...(architects[0] || {}) };
        break;
    }

    // Get documents
    const [documents] = await pool.execute(
      'SELECT document_type, original_name, uploaded_at FROM documents WHERE user_id = ?',
      [userId]
    );

    res.json({
      success: true,
      user: {
        ...user,
        ...roleSpecificData,
        documents
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Get user from database with password hash
    const [users] = await pool.execute(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.user_role, u.password, u.is_verified
       FROM users u WHERE u.email = ?`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Capitalize first letter of role for frontend
    const userRole = user.user_role.charAt(0).toUpperCase() + user.user_role.slice(1);

    // Get role-specific ID for customers, constructors, etc.
    let roleSpecificData = {};

    // Get role-specific IDs
    if (user.user_role === 'customer') {
      const [customers] = await pool.execute(
        'SELECT id FROM customers WHERE user_id = ?',
        [user.id]
      );
      if (customers.length > 0) {
        roleSpecificData.customer_id = customers[0].id;
      }
    } else if (user.user_role === 'constructor') {
      const [constructors] = await pool.execute(
        'SELECT id FROM constructors WHERE user_id = ?',
        [user.id]
      );
      if (constructors.length > 0) {
        roleSpecificData.constructor_id = constructors[0].id;
      }
    } else if (user.user_role === 'architect') {
      const [architects] = await pool.execute(
        'SELECT id FROM architects WHERE user_id = ?',
        [user.id]
      );
      if (architects.length > 0) {
        roleSpecificData.architect_id = architects[0].id;
      }
    } else if (user.user_role === 'supplier') {
      const [suppliers] = await pool.execute(
        'SELECT id FROM suppliers WHERE user_id = ?',
        [user.id]
      );
      if (suppliers.length > 0) {
        roleSpecificData.supplier_id = suppliers[0].id;
      }
    }

    res.json({
      success: true,
      message: 'Login successful',
      role: userRole,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: userRole,
        isVerified: user.is_verified,
        ...roleSpecificData
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  registerUser,
  getUserByEmail,
  getUserProfile,
  loginUser
};