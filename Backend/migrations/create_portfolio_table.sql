-- Portfolio Projects Table Migration
-- This table stores showcase projects for professionals (architects, constructors, suppliers)

-- Drop table if exists (for clean migration)
DROP TABLE IF EXISTS portfolio_projects;

-- Create portfolio_projects table
CREATE TABLE portfolio_projects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  
  -- Project information
  title VARCHAR(255) NOT NULL,
  description TEXT,
  project_type ENUM('residential', 'commercial', 'industrial', 'renovation', 'other') NOT NULL,
  location VARCHAR(255),
  budget_range VARCHAR(100),
  completion_date DATE,
  duration VARCHAR(100), -- "3 months", "6 weeks", etc.
  
  -- Images (stored as JSON array of file paths)
  images JSON, -- ["uploads/portfolio/img1.jpg", "uploads/portfolio/img2.jpg"]
  cover_image VARCHAR(500), -- Main display image for thumbnails
  
  -- Display settings
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign key constraint
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  -- Indexes for performance
  INDEX idx_user_visible (user_id, is_visible),
  INDEX idx_featured (is_featured, display_order),
  INDEX idx_project_type (project_type),
  INDEX idx_created (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add comment to table
ALTER TABLE portfolio_projects COMMENT = 'Portfolio showcase projects for professionals';

-- Verification query
SELECT 'Portfolio projects table created successfully!' AS status;
