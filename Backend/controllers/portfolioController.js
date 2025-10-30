const { pool } = require('../config/database');
const path = require('path');
const fs = require('fs').promises;

// Get all portfolio projects for a user
const getUserPortfolio = async (req, res) => {
  try {
    const { userId } = req.params;
    const { includeHidden } = req.query;

    let query = `
      SELECT * FROM portfolio_projects 
      WHERE user_id = ?
    `;

    // Only show visible projects unless explicitly requesting hidden ones
    if (!includeHidden || includeHidden !== 'true') {
      query += ' AND is_visible = true';
    }

    query += ' ORDER BY is_featured DESC, display_order ASC, created_at DESC';

    const [projects] = await pool.query(query, [userId]);

    // Parse JSON images for each project
    const projectsWithParsedImages = projects.map(project => ({
      ...project,
      images: project.images ? JSON.parse(project.images) : []
    }));

    res.json({
      success: true,
      count: projectsWithParsedImages.length,
      projects: projectsWithParsedImages
    });
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
};

// Get single portfolio project
const getPortfolioProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const [projects] = await pool.query(
      'SELECT * FROM portfolio_projects WHERE id = ?',
      [projectId]
    );

    if (projects.length === 0) {
      return res.status(404).json({ error: 'Portfolio project not found' });
    }

    const project = {
      ...projects[0],
      images: projects[0].images ? JSON.parse(projects[0].images) : []
    };

    res.json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Get portfolio project error:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio project' });
  }
};

// Create new portfolio project
const createPortfolioProject = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      title,
      description,
      project_type,
      location,
      budget_range,
      completion_date,
      duration,
      cover_image,
      is_featured = false,
      display_order = 0,
      is_visible = true
    } = req.body;

    // Handle uploaded images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path.replace(/\\/g, '/'));
    }

    const [result] = await pool.query(
      `INSERT INTO portfolio_projects 
       (user_id, title, description, project_type, location, budget_range, 
        completion_date, duration, images, cover_image, is_featured, display_order, is_visible)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        title,
        description,
        project_type,
        location,
        budget_range,
        completion_date,
        duration,
        JSON.stringify(images),
        cover_image || (images.length > 0 ? images[0] : null),
        is_featured,
        display_order,
        is_visible
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Portfolio project created successfully',
      projectId: result.insertId
    });
  } catch (error) {
    console.error('Create portfolio error:', error);
    res.status(500).json({ error: 'Failed to create portfolio project' });
  }
};

// Update portfolio project
const updatePortfolioProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;
    const {
      title,
      description,
      project_type,
      location,
      budget_range,
      completion_date,
      duration,
      cover_image,
      is_featured,
      display_order,
      is_visible
    } = req.body;

    // Verify ownership
    const [existing] = await pool.query(
      'SELECT user_id, images FROM portfolio_projects WHERE id = ?',
      [projectId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Portfolio project not found' });
    }

    if (existing[0].user_id !== userId) {
      return res.status(403).json({ error: 'You can only edit your own portfolio projects' });
    }

    // Handle new uploaded images
    let images = existing[0].images ? JSON.parse(existing[0].images) : [];
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path.replace(/\\/g, '/'));
      images = [...images, ...newImages];
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (title !== undefined) { updates.push('title = ?'); values.push(title); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (project_type !== undefined) { updates.push('project_type = ?'); values.push(project_type); }
    if (location !== undefined) { updates.push('location = ?'); values.push(location); }
    if (budget_range !== undefined) { updates.push('budget_range = ?'); values.push(budget_range); }
    if (completion_date !== undefined) { updates.push('completion_date = ?'); values.push(completion_date); }
    if (duration !== undefined) { updates.push('duration = ?'); values.push(duration); }
    if (images.length > 0) { updates.push('images = ?'); values.push(JSON.stringify(images)); }
    if (cover_image !== undefined) { updates.push('cover_image = ?'); values.push(cover_image); }
    if (is_featured !== undefined) { updates.push('is_featured = ?'); values.push(is_featured); }
    if (display_order !== undefined) { updates.push('display_order = ?'); values.push(display_order); }
    if (is_visible !== undefined) { updates.push('is_visible = ?'); values.push(is_visible); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(projectId);

    await pool.query(
      `UPDATE portfolio_projects SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({
      success: true,
      message: 'Portfolio project updated successfully'
    });
  } catch (error) {
    console.error('Update portfolio error:', error);
    res.status(500).json({ error: 'Failed to update portfolio project' });
  }
};

// Delete portfolio project
const deletePortfolioProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;

    // Verify ownership
    const [existing] = await pool.query(
      'SELECT user_id, images FROM portfolio_projects WHERE id = ?',
      [projectId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Portfolio project not found' });
    }

    if (existing[0].user_id !== userId) {
      return res.status(403).json({ error: 'You can only delete your own portfolio projects' });
    }

    // Delete associated images from filesystem
    if (existing[0].images) {
      const images = JSON.parse(existing[0].images);
      for (const imagePath of images) {
        try {
          await fs.unlink(imagePath);
        } catch (err) {
          console.error('Error deleting image:', imagePath, err);
        }
      }
    }

    // Delete from database
    await pool.query('DELETE FROM portfolio_projects WHERE id = ?', [projectId]);

    res.json({
      success: true,
      message: 'Portfolio project deleted successfully'
    });
  } catch (error) {
    console.error('Delete portfolio error:', error);
    res.status(500).json({ error: 'Failed to delete portfolio project' });
  }
};

// Delete specific image from portfolio project
const deletePortfolioImage = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { imagePath } = req.body;
    const userId = req.user.userId;

    // Verify ownership
    const [existing] = await pool.query(
      'SELECT user_id, images, cover_image FROM portfolio_projects WHERE id = ?',
      [projectId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Portfolio project not found' });
    }

    if (existing[0].user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const images = existing[0].images ? JSON.parse(existing[0].images) : [];
    const updatedImages = images.filter(img => img !== imagePath);

    // Update cover image if it was deleted
    let newCoverImage = existing[0].cover_image;
    if (existing[0].cover_image === imagePath) {
      newCoverImage = updatedImages.length > 0 ? updatedImages[0] : null;
    }

    // Update database
    await pool.query(
      'UPDATE portfolio_projects SET images = ?, cover_image = ? WHERE id = ?',
      [JSON.stringify(updatedImages), newCoverImage, projectId]
    );

    // Delete file from filesystem
    try {
      await fs.unlink(imagePath);
    } catch (err) {
      console.error('Error deleting image file:', err);
    }

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};

module.exports = {
  getUserPortfolio,
  getPortfolioProject,
  createPortfolioProject,
  updatePortfolioProject,
  deletePortfolioProject,
  deletePortfolioImage
};
