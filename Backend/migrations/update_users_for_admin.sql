-- Migration: Update users table for admin verification system
-- Purpose: Add verification and account status fields to existing users table
-- Author: System
-- Date: 2025-10-14

USE bid2build;

-- Add verification and admin management columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS verification_status ENUM('pending', 'verified', 'rejected', 'suspended') DEFAULT 'pending' 
    COMMENT 'User verification status managed by admin' AFTER user_role,

ADD COLUMN IF NOT EXISTS verified_by INT NULL 
    COMMENT 'Admin ID who verified this user' AFTER verification_status,

ADD COLUMN IF NOT EXISTS verified_at DATETIME NULL 
    COMMENT 'Timestamp when user was verified' AFTER verified_by,

ADD COLUMN IF NOT EXISTS rejection_reason TEXT NULL 
    COMMENT 'Reason for rejection if verification_status is rejected' AFTER verified_at,

ADD COLUMN IF NOT EXISTS account_status ENUM('active', 'suspended', 'inactive') DEFAULT 'active' 
    COMMENT 'Account status - suspended users cannot login' AFTER rejection_reason,

ADD COLUMN IF NOT EXISTS suspended_by INT NULL 
    COMMENT 'Admin ID who suspended this account' AFTER account_status,

ADD COLUMN IF NOT EXISTS suspended_at DATETIME NULL 
    COMMENT 'Timestamp when account was suspended' AFTER suspended_by,

ADD COLUMN IF NOT EXISTS suspension_reason TEXT NULL 
    COMMENT 'Reason for account suspension' AFTER suspended_at;

-- Add foreign key constraints for admin references
-- Note: We'll add these after admin_users table exists
ALTER TABLE users 
ADD CONSTRAINT fk_users_verified_by 
    FOREIGN KEY (verified_by) REFERENCES admin_users(id) ON DELETE SET NULL,

ADD CONSTRAINT fk_users_suspended_by 
    FOREIGN KEY (suspended_by) REFERENCES admin_users(id) ON DELETE SET NULL;

-- Add indexes for better query performance
ALTER TABLE users 
ADD INDEX idx_verification_status (verification_status),
ADD INDEX idx_account_status (account_status),
ADD INDEX idx_verified_at (verified_at),
ADD INDEX idx_suspended_at (suspended_at);

-- Update existing users to have 'verified' status if they're already active
-- (This ensures existing users don't get locked out)
UPDATE users 
SET verification_status = 'verified', 
    verified_at = NOW()
WHERE verification_status = 'pending' 
  AND created_at < NOW() - INTERVAL 1 DAY; -- Only for users created before today

-- Success message
SELECT '✅ Users table updated with verification fields!' AS message;