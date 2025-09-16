import api from './api.js';

const projectService = {
  // Create a new project
  createProject: async (projectData, files = null) => {
    try {
      const formData = new FormData();
      
      // Add project data
      Object.keys(projectData).forEach(key => {
        formData.append(key, projectData[key]);
      });
      
      // Add files if provided
      if (files) {
        if (files.projectPlan) {
          formData.append('projectPlan', files.projectPlan);
        }
        if (files.legalDocs && files.legalDocs.length > 0) {
          files.legalDocs.forEach(file => {
            formData.append('legalDocs', file);
          });
        }
      }
      
      const response = await api.post('/projects', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all projects (for testing)
  getAllProjects: async () => {
    try {
      const response = await api.get('/projects');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get projects for constructors (with plans)
  getProjectsForConstructors: async () => {
    try {
      const response = await api.get('/projects/constructor');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get projects for architects (without plans, need architect)
  getProjectsForArchitects: async () => {
    try {
      const response = await api.get('/projects/architect');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get projects by customer
  getCustomerProjects: async (customerId) => {
    try {
      const response = await api.get(`/projects/customer/${customerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get project by ID
  getProjectById: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update project
  updateProject: async (projectId, updates, files = null) => {
    try {
      const formData = new FormData();
      
      // Add updates
      Object.keys(updates).forEach(key => {
        formData.append(key, updates[key]);
      });
      
      // Add files if provided
      if (files) {
        if (files.projectPlan) {
          formData.append('projectPlan', files.projectPlan);
        }
        if (files.legalDocs && files.legalDocs.length > 0) {
          files.legalDocs.forEach(file => {
            formData.append('legalDocs', file);
          });
        }
      }
      
      const response = await api.put(`/projects/${projectId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete project
  deleteProject: async (projectId) => {
    try {
      const response = await api.delete(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Download project file
  downloadProjectFile: async (projectId, fileId) => {
    try {
      const response = await api.get(`/projects/${projectId}/files/${fileId}/download`, {
        responseType: 'blob' // Important for file downloads
      });
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default projectService;