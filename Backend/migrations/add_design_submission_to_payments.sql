-- Migration: Add design_submission_id to payments table
-- Purpose: Link architect payments to design submissions (similar to progress_update_id for constructors)
-- Author: System
-- Date: 2025-10-14

USE bid2build;

-- Check if column already exists before adding
SET @dbname = DATABASE();
SET @tablename = 'payments';
SET @columnname = 'design_submission_id';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT ''Column already exists'' AS message;',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' INT NULL COMMENT "Links to architect design submission" AFTER progress_update_id, ADD CONSTRAINT fk_payments_design_submission FOREIGN KEY (', @columnname, ') REFERENCES design_submissions(id) ON DELETE SET NULL;')
));

PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Success message
SELECT 'design_submission_id column added to payments table (or already exists)!' AS message;
