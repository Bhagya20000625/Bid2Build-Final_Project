import React, { useState } from 'react';
import { ArrowLeft, Compass, FileText } from 'lucide-react';

export default function ArchitectForm({ onBack, onSubmit }) {
  const [formData, setFormData] = useState({
    specialization: '',
    portfolioUrl: '',
    designSoftware: '',
    licenseNumber: '',
    professionalLicense: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back Button */}
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          type="button"
          className="flex items-center text-purple-600 hover:text-purple-700 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Compass className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Architect Details</h2>
        <p className="text-gray-600">Provide your expertise and verification details</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Specialization */}
        <div>
          <label htmlFor="specialization" className="block text-sm font-medium text-gray-600 mb-2">
            Specialization
          </label>
          <select
            id="specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="">Select specialization</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="interior">Interior Design</option>
            <option value="landscape">Landscape Architecture</option>
            <option value="urban-planning">Urban Planning</option>
            <option value="sustainable">Sustainable Design</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Portfolio Link */}
        <div>
          <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-600 mb-2">
            Portfolio Link / Sample Work
          </label>
          <input
            type="url"
            id="portfolioUrl"
            name="portfolioUrl"
            value={formData.portfolioUrl}
            onChange={handleInputChange}
            placeholder="https://yourportfolio.com"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Design Software */}
        <div>
          <label htmlFor="designSoftware" className="block text-sm font-medium text-gray-600 mb-2">
            Design Software Expertise (optional)
          </label>
          <input
            type="text"
            id="designSoftware"
            name="designSoftware"
            value={formData.designSoftware}
            onChange={handleInputChange}
            placeholder="e.g., AutoCAD, Revit, SketchUp"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* License Number */}
        <div>
          <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-600 mb-2">
            License / Registration Number
          </label>
          <input
            type="text"
            id="licenseNumber"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleInputChange}
            placeholder="Enter license number"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        {/* Professional License Upload */}
        <div>
          <label htmlFor="professionalLicense" className="block text-sm font-medium text-gray-600 mb-2">
            Upload Professional License
          </label>
          <input
            type="file"
            id="professionalLicense"
            name="professionalLicense"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="w-full"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 focus:ring-4 focus:ring-purple-300 transition-all duration-200"
        >
          Complete Registration
        </button>
      </form>
    </div>
  );
}