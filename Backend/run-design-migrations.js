const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigrations() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bid2build',
    port: process.env.DB_PORT || 3306,
    multipleStatements: true
  });

  try {
    console.log('🚀 Starting design tables migration...');

    // Create design_submissions table (using MyISAM to match existing tables)
    console.log('Creating design_submissions table...');
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS design_submissions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        project_id INT NOT NULL,
        bid_id INT NOT NULL,
        architect_id INT NOT NULL COMMENT 'User ID of the architect',
        client_id INT NOT NULL COMMENT 'User ID of the client',
        title VARCHAR(255) NOT NULL COMMENT 'Design submission title',
        description TEXT COMMENT 'Design description/notes',
        status ENUM('pending_review', 'approved', 'rejected') DEFAULT 'pending_review' COMMENT 'Submission review status',
        payment_amount DECIMAL(10,2) NOT NULL COMMENT 'Payment amount for design work',
        submitted_at DATETIME DEFAULT NOW(),
        reviewed_at DATETIME NULL,
        reviewed_by INT NULL COMMENT 'User ID who reviewed (client)',
        review_comments TEXT NULL,
        created_at DATETIME DEFAULT NOW(),
        INDEX idx_design_project (project_id),
        INDEX idx_design_architect (architect_id),
        INDEX idx_design_status (status),
        INDEX idx_design_submitted_at (submitted_at)
      ) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COMMENT='Architect design submissions for projects'
    `);
    console.log('✅ design_submissions table created');

    // Create design_files table
    console.log('Creating design_files table...');
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS design_files (
        id INT PRIMARY KEY AUTO_INCREMENT,
        design_submission_id INT NOT NULL,
        file_path VARCHAR(500) NOT NULL COMMENT 'Path to uploaded file',
        file_name VARCHAR(255) NOT NULL COMMENT 'Original file name',
        file_type VARCHAR(50) COMMENT 'MIME type of file',
        file_size BIGINT COMMENT 'File size in bytes',
        uploaded_at DATETIME DEFAULT NOW(),
        INDEX idx_design_files_submission (design_submission_id)
      ) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COMMENT='Files attached to design submissions (PDFs, CAD, images)'
    `);
    console.log('✅ design_files table created');

    // Add design_submission_id to payments table
    console.log('Adding design_submission_id to payments table...');
    try {
      await pool.execute(`
        ALTER TABLE payments
        ADD COLUMN design_submission_id INT NULL COMMENT 'Links to architect design submission' AFTER progress_update_id
      `);
      console.log('✅ design_submission_id column added to payments table');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('⚠️  design_submission_id column already exists in payments table');
      } else {
        throw err;
      }
    }

    await pool.end();
    console.log('🎉 All migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    console.error('Error code:', error.code);
    process.exit(1);
  }
}

runMigrations();
