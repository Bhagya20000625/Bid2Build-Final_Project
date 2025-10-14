-- Fix design_submissions records with client_id = 0
-- Update them to get the correct client_id from the project table

UPDATE design_submissions ds
JOIN projects p ON ds.project_id = p.id
SET ds.client_id = p.user_id
WHERE ds.client_id = 0 OR ds.client_id IS NULL;
