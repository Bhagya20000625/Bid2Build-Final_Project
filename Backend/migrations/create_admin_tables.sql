-- Migration: Create admin system tables for Bid2Build platform
-- Purpose: Enable admin dashboard functionality with user verification and management
-- Author: System
-- Date: 2025-10-14

USE bid2build;

-- Create admin_users table (separate from regular users for security)
CREATE TABLE IF NOT EXISTS admin_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) UNIQUE NOT NULL COMMENT 'Admin username for login',
  email VARCHAR(255) UNIQUE NOT NULL COMMENT 'Admin email address',
  password VARCHAR(255) NOT NULL COMMENT 'Hashed password using bcrypt',
  first_name VARCHAR(100) NOT NULL COMMENT 'Admin first name',
  last_name VARCHAR(100) NOT NULL COMMENT 'Admin last name',
  status ENUM('active', 'inactive') DEFAULT 'active' COMMENT 'Admin account status',
  created_at DATETIME DEFAULT NOW() COMMENT 'Account creation timestamp',
  last_login DATETIME NULL COMMENT 'Last login timestamp',
  created_by INT NULL COMMENT 'ID of admin who created this account',
  INDEX idx_admin_username (username),
  INDEX idx_admin_email (email),
  INDEX idx_admin_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Admin user accounts for platform management';

-- Create verification_documents table (store uploaded professional documents)
CREATE TABLE IF NOT EXISTS verification_documents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL COMMENT 'Reference to users table',
  document_type ENUM('license', 'business_registration', 'insurance', 'portfolio', 'tax_id', 'other') NOT NULL COMMENT 'Type of document uploaded',
  file_path VARCHAR(500) NOT NULL COMMENT 'Path to uploaded file in uploads directory',
  file_name VARCHAR(255) NOT NULL COMMENT 'Original filename as uploaded',
  file_type VARCHAR(50) COMMENT 'MIME type of file (application/pdf, image/jpeg, etc.)',
  file_size BIGINT COMMENT 'File size in bytes',
  uploaded_at DATETIME DEFAULT NOW() COMMENT 'Upload timestamp',
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' COMMENT 'Document verification status',
  reviewed_by INT NULL COMMENT 'Admin ID who reviewed this document',
  reviewed_at DATETIME NULL COMMENT 'Review timestamp',
  review_notes TEXT NULL COMMENT 'Admin notes on document review',
  CONSTRAINT fk_verification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_verification_reviewer FOREIGN KEY (reviewed_by) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_verification_user (user_id),
  INDEX idx_verification_type (document_type),
  INDEX idx_verification_status (status),
  INDEX idx_verification_uploaded (uploaded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Documents uploaded by users for professional verification';

-- Create verification_history table (track all admin verification actions)
CREATE TABLE IF NOT EXISTS verification_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL COMMENT 'User who was verified/rejected',
  admin_id INT NOT NULL COMMENT 'Admin who performed the action',
  action ENUM('approved', 'rejected', 'suspended', 'reactivated') NOT NULL COMMENT 'Admin action taken',
  comment TEXT NULL COMMENT 'Admin comment explaining the action',
  previous_status VARCHAR(50) NULL COMMENT 'Previous verification status',
  new_status VARCHAR(50) NOT NULL COMMENT 'New verification status after action',
  created_at DATETIME DEFAULT NOW() COMMENT 'Action timestamp',
  CONSTRAINT fk_history_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_history_admin FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE,
  INDEX idx_history_user (user_id),
  INDEX idx_history_admin (admin_id),
  INDEX idx_history_action (action),
  INDEX idx_history_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Audit log of all admin verification actions';

-- Create admin_notifications table (admin-specific notifications)
CREATE TABLE IF NOT EXISTS admin_notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  admin_id INT NULL COMMENT 'Specific admin to notify, NULL for all admins',
  type ENUM('new_registration', 'verification_needed', 'user_suspended', 'document_uploaded', 'system_alert') NOT NULL COMMENT 'Notification category',
  title VARCHAR(255) NOT NULL COMMENT 'Notification title/subject',
  message TEXT NOT NULL COMMENT 'Notification message content',
  related_user_id INT NULL COMMENT 'User related to this notification',
  related_document_id INT NULL COMMENT 'Document related to this notification',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium' COMMENT 'Notification priority level',
  is_read BOOLEAN DEFAULT FALSE COMMENT 'Whether notification has been read',
  created_at DATETIME DEFAULT NOW() COMMENT 'Notification creation timestamp',
  read_at DATETIME NULL COMMENT 'When notification was marked as read',
  CONSTRAINT fk_admin_notification_admin FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE,
  CONSTRAINT fk_admin_notification_user FOREIGN KEY (related_user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_admin_notification_document FOREIGN KEY (related_document_id) REFERENCES verification_documents(id) ON DELETE CASCADE,
  INDEX idx_admin_notif_admin (admin_id),
  INDEX idx_admin_notif_type (type),
  INDEX idx_admin_notif_read (is_read),
  INDEX idx_admin_notif_priority (priority),
  INDEX idx_admin_notif_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Notifications for admin users about platform activities';

-- Success message
SELECT '✅ Admin tables created successfully!' AS message;