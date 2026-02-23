import React, { useState } from 'react';
import { ArrowLeft, HardHat, FileText, Briefcase } from 'lucide-react';

export default function ConstructorForm({ onBack, onSubmit }) {
  const [formData, setFormData] = useState({
    companyName: '',
    specialization: '',
    licenseNumber: '',
    portfolioUrl: '',
    businessCertificate: null,
    relevantLicenses: null
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
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <HardHat className="w-8 h-8 text-orange-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Constructor Details</h2>
        <p className="text-gray-600">Provide your business and verification details</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Company Name */}
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-600 mb-2">
            Company Name (if applicable)
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="Enter company name"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

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
            <option value="civil">Civil</option>
            <option value="electrical">Electrical</option>
            <option value="plumbing">Plumbing</option>
            <option value="carpentry">Carpentry</option>
            <option value="roofing">Roofing</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* License/Registration Number */}
        <div>
          <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-600 mb-2">
            License/Registration Number
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

        {/* Portfolio URL */}
        <div>
          <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-600 mb-2">
            Portfolio URL (optional)
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

        {/* Business Registration Certificate */}
        <div>
          <label htmlFor="businessCertificate" className="block text-sm font-medium text-gray-600 mb-2">
            Business Registration Certificate
          </label>
          <input
            type="file"
            id="businessCertificate"
            name="businessCertificate"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="w-full"
            required
          />
        </div>

        {/* Relevant Licenses */}
        <div>
          <label htmlFor="relevantLicenses" className="block text-sm font-medium text-gray-600 mb-2">
            Relevant Licenses
          </label>
          <input
            type="file"
            id="relevantLicenses"
            name="relevantLicenses"
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