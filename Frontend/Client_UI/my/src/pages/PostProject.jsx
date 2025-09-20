import React, { useState } from 'react';
import { Upload, MapPin, Calendar, DollarSign, FileText, User } from 'lucide-react';

const PostProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    budget: '',
    timeline: '',
    category: '',
    needsArchitect: false
  });

  const [files, setFiles] = useState({
    projectPlan: null,
    legalDocs: []
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value
    }));
  };

  const handleFileUpload = (type, file) => {
    if (type === 'projectPlan') {
      setFiles(prev => ({ ...prev, projectPlan: file }));
    } else {
      setFiles(prev => ({ ...prev, legalDocs: [...prev.legalDocs, file] }));
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Create FormData for file uploads
      const formDataToSend = new FormData();

      // Add text fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('budget_range', formData.budget);
      formDataToSend.append('timeline', formData.timeline);
      formDataToSend.append('needs_architect', formData.needsArchitect);
      formDataToSend.append('customer_id', 1); // TODO: Get from auth context

      // Add files if present
      if (files.projectPlan) {
        formDataToSend.append('projectPlan', files.projectPlan);
      }

      files.legalDocs.forEach((file, index) => {
        formDataToSend.append('legalDocs', file);
      });

      console.log('Submitting project with data:', formData);

      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          title: '',
          description: '',
          location: '',
          budget: '',
          timeline: '',
          category: '',
          needsArchitect: false
        });
        setFiles({
          projectPlan: null,
          legalDocs: []
        });
        alert('Project posted successfully!');
      } else {
        throw new Error(result.message || 'Failed to post project');
      }

    } catch (error) {
      console.error('Error posting project:', error);
      setError(error.message);
      alert(`Error posting project: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Post New Project</h1>
        <p className="text-gray-600">Create a new construction project and invite contractors to bid</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Project Information</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="e.g., Modern Office Building Construction"
                required
              />
            </div>
            
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Describe your project in detail..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Project location"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                required
              >
                <option value="">Select a category</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
                <option value="renovation">Renovation</option>
                <option value="infrastructure">Infrastructure</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                >
                  <option value="">Select budget range</option>
                  <option value="0-50k">$0 - $50,000</option>
                  <option value="50k-100k">$50,000 - $100,000</option>
                  <option value="100k-500k">$100,000 - $500,000</option>
                  <option value="500k-1m">$500,000 - $1,000,000</option>
                  <option value="1m+">$1,000,000+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                >
                  <option value="">Select timeline</option>
                  <option value="1-3months">1-3 months</option>
                  <option value="3-6months">3-6 months</option>
                  <option value="6-12months">6-12 months</option>
                  <option value="12months+">12+ months</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Documents</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Plan (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
                <Upload className="mx-auto w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload project plans, blueprints, or drawings</p>
                <input
                  type="file"
                  accept=".pdf,.dwg,.jpg,.png"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('projectPlan', e.target.files[0])}
                  className="hidden"
                  id="project-plan"
                />
                <label 
                  htmlFor="project-plan"
                  className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  Choose File
                </label>
                {files.projectPlan && (
                  <p className="text-sm text-green-600 mt-2">✓ {files.projectPlan.name}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Legal Documents</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
                <FileText className="mx-auto w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload permits, contracts, or legal documents</p>
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      Array.from(e.target.files).forEach(file => 
                        handleFileUpload('legalDocs', file)
                      );
                    }
                  }}
                  className="hidden"
                  id="legal-docs"
                />
                <label 
                  htmlFor="legal-docs"
                  className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  Choose Files
                </label>
                {files.legalDocs.length > 0 && (
                  <p className="text-sm text-green-600 mt-2">✓ {files.legalDocs.length} file(s) selected</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Need an Architect?</h3>
              <p className="text-gray-600 mb-4">Don't have project plans yet? We can connect you with qualified architects.</p>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="needsArchitect"
                  checked={formData.needsArchitect}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Yes, I need help from an architect</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Post Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostProject;