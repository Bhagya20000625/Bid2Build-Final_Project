import express from 'express';
import bcrypt from 'bcryptjs';
import { executeQuery, getOne } from '../config/database.js';
import { validateRequest, schemas } from '../middleware/validation.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

// Register new user
router.post('/register', validateRequest(schemas.register), async (req, res) => {
  try {
    const { email, password, first_name, last_name, user_role, phone } = req.validatedData;

    // Check if user already exists
    const existingUser = await getOne(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert user
    const result = await executeQuery(
      `INSERT INTO users (email, password_hash, first_name, last_name, user_role, phone, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [email, password_hash, first_name, last_name, user_role, phone]
    );

    const userId = result.insertId;

    // Create role-specific profile based on user_role
    if (user_role === 'customer') {
      await executeQuery(
        'INSERT INTO customers (user_id, created_at) VALUES (?, NOW())',
        [userId]
      );
    } else if (user_role === 'constructor') {
      await executeQuery(
        'INSERT INTO constructors (user_id, created_at) VALUES (?, NOW())',
        [userId]
      );
    } else if (user_role === 'architect') {
      await executeQuery(
        'INSERT INTO architects (user_id, created_at) VALUES (?, NOW())',
        [userId]
      );
    } else if (user_role === 'supplier') {
      await executeQuery(
        'INSERT INTO suppliers (user_id, created_at) VALUES (?, NOW())',
        [userId]
      );
    }

    // Generate JWT token
    const token = generateToken(userId);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: userId,
        email,
        first_name,
        last_name,
        user_role
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'Internal server error'
    });
  }
});

// Login user
router.post('/login', validateRequest(schemas.login), async (req, res) => {
  try {
    const { email, password } = req.validatedData;

    // Get user with password
    const user = await getOne(
      'SELECT id, email, password_hash, first_name, last_name, user_role, is_verified FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        user_role: user.user_role,
        is_verified: user.is_verified
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'Internal server error'
    });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Access token required',
        message: 'Please provide authentication token'
      });
    }

    // This would use the authenticateToken middleware in real implementation
    // For now, just return a simple response
    res.json({
      message: 'Profile endpoint - implement with auth middleware',
      token: token ? 'provided' : 'missing'
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      error: 'Failed to get profile',
      message: 'Internal server error'
    });
  }
});

export default router;