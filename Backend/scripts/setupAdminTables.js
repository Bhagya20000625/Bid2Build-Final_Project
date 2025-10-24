const { pool } = require('../config/database');

async function createTables() {
  try {
    console.log('🔧 Creating admin_users table...');

    // Create admin_users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at DATETIME DEFAULT NOW(),
        last_login DATETIME NULL,
        created_by INT NULL,
        INDEX idx_admin_username (username),
        INDEX idx_admin_email (email),
        INDEX idx_admin_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    console.log('✅ admin_users table created');

    // Create verification_documents table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS verification_documents (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        document_type ENUM('license', 'business_registration', 'insurance', 'portfolio', 'tax_id', 'other') NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_type VARCHAR(50),
        file_size BIGINT,
        uploaded_at DATETIME DEFAULT NOW(),
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        reviewed_by INT NULL,
        reviewed_at DATETIME NULL,
        review_notes TEXT NULL,
        INDEX idx_verification_user (user_id),
        INDEX idx_verification_type (document_type),
        INDEX idx_verification_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    console.log('✅ verification_documents table created');

    // Create verification_history table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS verification_history (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        admin_id INT NOT NULL,
        action ENUM('approved', 'rejected', 'suspended', 'reactivated') NOT NULL,
        comment TEXT NULL,
        previous_status VARCHAR(50) NULL,
        new_status VARCHAR(50) NOT NULL,
        created_at DATETIME DEFAULT NOW(),
        INDEX idx_history_user (user_id),
        INDEX idx_history_admin (admin_id),
        INDEX idx_history_action (action)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    console.log('✅ verification_history table created');

    // Create admin_notifications table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS admin_notifications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        admin_id INT NULL,
        type ENUM('new_registration', 'verification_needed', 'user_suspended', 'document_uploaded', 'system_alert') NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        related_user_id INT NULL,
        related_document_id INT NULL,
        priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
        is_read BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT NOW(),
        read_at DATETIME NULL,
        INDEX idx_admin_notif_admin (admin_id),
        INDEX idx_admin_notif_type (type),
        INDEX idx_admin_notif_read (is_read)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    console.log('✅ admin_notifications table created');

    // Update users table
    console.log('🔧 Updating users table...');
    
    try {
      await pool.execute(`
        ALTER TABLE users 
        ADD COLUMN verification_status ENUM('pending', 'verified', 'rejected', 'suspended') DEFAULT 'pending' AFTER user_role
      `);
      console.log('✅ Added verification_status column');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('⚠️  verification_status column already exists');
      } else {
        throw err;
      }
    }

    try {
      await pool.execute(`
        ALTER TABLE users 
        ADD COLUMN verified_by INT NULL AFTER verification_status,
        ADD COLUMN verified_at DATETIME NULL AFTER verified_by,
        ADD COLUMN rejection_reason TEXT NULL AFTER verified_at,
        ADD COLUMN account_status ENUM('active', 'suspended', 'inactive') DEFAULT 'active' AFTER rejection_reason
      `);
      console.log('✅ Added verification fields to users table');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('⚠️  Verification fields already exist in users table');
      } else {
        throw err;
      }
    }

    console.log('🎉 All tables created successfully!');

  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
}

if (require.main === module) {
  createTables()
    .then(() => {
      console.log('✅ Setup completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { createTables };