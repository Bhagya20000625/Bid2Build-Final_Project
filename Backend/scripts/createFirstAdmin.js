const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

/**
 * Script to create the first admin user for the Bid2Build platform
 * Run this once after creating the admin tables
 * 
 * Usage: node scripts/createFirstAdmin.js
 */

async function createFirstAdmin() {
  try {
    console.log('🔐 Creating first admin user...');

    // Admin credentials (change these in production!)
    const adminData = {
      username: 'superadmin',
      email: 'admin@bid2build.com',
      password: 'Admin@123456', // Change this password!
      firstName: 'Super',
      lastName: 'Admin'
    };

    // Check if admin already exists
    const [existingAdmin] = await pool.execute(
      'SELECT id FROM admin_users WHERE username = ? OR email = ?',
      [adminData.username, adminData.email]
    );

    if (existingAdmin.length > 0) {
      console.log('⚠️  Admin user already exists!');
      console.log('Existing admin:', existingAdmin[0]);
      return;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

    // Insert the admin user
    const [result] = await pool.execute(
      `INSERT INTO admin_users 
       (username, email, password, first_name, last_name, status, created_at) 
       VALUES (?, ?, ?, ?, ?, 'active', NOW())`,
      [
        adminData.username,
        adminData.email,
        hashedPassword,
        adminData.firstName,
        adminData.lastName
      ]
    );

    console.log('✅ First admin user created successfully!');
    console.log('📋 Admin Details:');
    console.log(`   ID: ${result.insertId}`);
    console.log(`   Username: ${adminData.username}`);
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Password: ${adminData.password} (CHANGE THIS!)`);
    console.log('');
    console.log('🔗 Admin Login URL: http://localhost:5000/admin/login');
    console.log('⚠️  IMPORTANT: Change the default password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  createFirstAdmin()
    .then(() => {
      console.log('✅ Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { createFirstAdmin };