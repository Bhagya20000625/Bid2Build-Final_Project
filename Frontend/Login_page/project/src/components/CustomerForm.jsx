import React, { useState } from 'react';
import { ArrowLeft, User, MapPin, FileText } from 'lucide-react';

export default function CustomerForm({ onBack, onSubmit }) {
  const [formData, setFormData] = useState({
    location: '',
    document: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      document: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
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

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Customer Details</h2>
        <p className="text-gray-600">Provide details to help match you with the right professionals</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-600 mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="City, District"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Document Upload */}
        <div>
          <label htmlFor="document" className="block text-sm font-medium text-gray-600 mb-2">
            Upload Verification Document (Optional)
          </label>
          <input
            type="file"
            id="document"
            name="document"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 focus:ring-4 focus:ring-purple-300 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Complete Registration
        </button>
      </form>
    </div>
  );
}