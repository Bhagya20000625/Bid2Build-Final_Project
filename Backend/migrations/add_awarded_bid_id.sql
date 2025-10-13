-- Add awarded_bid_id column to projects table
-- Run this SQL in your phpMyAdmin or MySQL client

USE bid2build;

-- Check if column already exists
SET @dbname = 'bid2build';
SET @tablename = 'projects';
SET @columnname = 'awarded_bid_id';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' INT NULL COMMENT "ID of the winning bid", ADD CONSTRAINT fk_projects_awarded_bid FOREIGN KEY (', @columnname, ') REFERENCES bids(id) ON DELETE SET NULL;')
));

PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Verify the column was added
SELECT 'Column awarded_bid_id added/exists successfully!' as status;
DESCRIBE projects;
