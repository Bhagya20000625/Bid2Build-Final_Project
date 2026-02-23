import React, { useState } from 'react';
import { ArrowLeft, Package } from 'lucide-react';

export default function SupplierForm({ onBack, onSubmit }) {
  const [formData, setFormData] = useState({
    businessName: '',
    businessRegNumber: '',
    serviceArea: '',
    registrationCertificate: null,
    catalogFile: null
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
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Supplier Details</h2>
        <p className="text-gray-600">Provide your business and product details</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Name */}
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-600 mb-2">
            Business Name
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleInputChange}
            placeholder="Enter your business name"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        {/* Business Registration Number */}
        <div>
          <label htmlFor="businessRegNumber" className="block text-sm font-medium text-gray-600 mb-2">
            Business Registration Number
          </label>
          <input
            type="text"
            id="businessRegNumber"
            name="businessRegNumber"
            value={formData.businessRegNumber}
            onChange={handleInputChange}
            placeholder="Enter registration number"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        {/* Service Area */}
        <div>
          <label htmlFor="serviceArea" className="block text-sm font-medium text-gray-600 mb-2">
            Service Area
          </label>
          <input
            type="text"
            id="serviceArea"
            name="serviceArea"
            value={formData.serviceArea}
            onChange={handleInputChange}
            placeholder="Cities/regions you deliver to"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        {/* Document Uploads */}
        <div>
          <label htmlFor="registrationCertificate" className="block text-sm font-medium text-gray-600 mb-2">
            Upload Business Registration Certificate
          </label>
          <input
            type="file"
            id="registrationCertificate"
            name="registrationCertificate"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="catalogFile" className="block text-sm font-medium text-gray-600 mb-2">
            Upload Catalog / Price List (Optional)
          </label>
          <input
            type="file"
            id="catalogFile"
            name="catalogFile"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="w-full"
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