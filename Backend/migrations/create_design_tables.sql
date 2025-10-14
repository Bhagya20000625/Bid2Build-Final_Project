-- Migration: Create design_submissions and design_files tables for architect workflow
-- Purpose: Store architect design submissions similar to constructor progress_updates
-- Author: System
-- Date: 2025-10-14

USE bid2build;

-- Create design_submissions table (architect equivalent of progress_updates)
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
  CONSTRAINT fk_design_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_design_bid FOREIGN KEY (bid_id) REFERENCES bids(id) ON DELETE CASCADE,
  CONSTRAINT fk_design_architect FOREIGN KEY (architect_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_design_client FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_design_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_design_project (project_id),
  INDEX idx_design_architect (architect_id),
  INDEX idx_design_status (status),
  INDEX idx_design_submitted_at (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Architect design submissions for projects';

-- Create design_files table (stores uploaded design files)
CREATE TABLE IF NOT EXISTS design_files (
  id INT PRIMARY KEY AUTO_INCREMENT,
  design_submission_id INT NOT NULL,
  file_path VARCHAR(500) NOT NULL COMMENT 'Path to uploaded file',
  file_name VARCHAR(255) NOT NULL COMMENT 'Original file name',
  file_type VARCHAR(50) COMMENT 'MIME type of file',
  file_size BIGINT COMMENT 'File size in bytes',
  uploaded_at DATETIME DEFAULT NOW(),
  CONSTRAINT fk_design_files_submission FOREIGN KEY (design_submission_id) REFERENCES design_submissions(id) ON DELETE CASCADE,
  INDEX idx_design_files_submission (design_submission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Files attached to design submissions (PDFs, CAD, images)';

-- Success message
SELECT 'Design tables created successfully!' AS message;
