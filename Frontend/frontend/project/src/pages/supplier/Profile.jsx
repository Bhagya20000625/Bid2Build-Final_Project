import React, { useState } from 'react';
import { User, Edit, Save, X, Building, Phone, Mail, MapPin } from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    companyName: 'GreenBuild Supplies',
    contactPerson: 'Michael Anderson',
    email: 'contact@greenbuildsupplies.com',
    phone: '+1 234-567-8900',
    address: '123 Industrial Ave, Supply City, SC 12345',
    businessType: 'Material Supplier',
    specializations: ['Concrete & Cement', 'Steel & Metal', 'Electrical Supplies'],
    yearsInBusiness: 15,
    certifications: ['ISO 9001', 'Safety Certified', 'Environmental Standard'],
    description: 'Leading supplier of high-quality construction materials with over 15 years of experience. We specialize in concrete, steel, and electrical supplies for commercial and residential projects.',
    workingHours: 'Monday - Friday: 7:00 AM - 6:00 PM\nSaturday: 8:00 AM - 4:00 PM\nSunday: Closed',
    deliveryRadius: '50 miles',
    minimumOrder: '$500'
  });

  const [editData, setEditData] = useState({ ...profileData });

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
  };

  const handleSave = () => {
    // TODO: Implement API call to save profile data
    setProfileData({ ...editData });
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpecializationChange = (index, value) => {
    const newSpecializations = [...editData.specializations];
    newSpecializations[index] = value;
    setEditData(prev => ({
      ...prev,
      specializations: newSpecializations
    }));
  };

  const addSpecialization = () => {
    setEditData(prev => ({
      ...prev,
      specializations: [...prev.specializations, '']
    }));
  };

  const removeSpecialization = (index) => {
    const newSpecializations = editData.specializations.filter((_, i) => i !== index);
    setEditData(prev => ({
      ...prev,
      specializations: newSpecializations
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your supplier profile and business information</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
              <Building className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="text-xl font-semibold border border-gray-300 rounded px-2 py-1"
                  />
                ) : (
                  profileData.companyName
                )}
              </h2>
              <p className="text-gray-600">{profileData.businessType}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{profileData.contactPerson}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{profileData.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{profileData.phone}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years in Business</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editData.yearsInBusiness}
                    onChange={(e) => handleInputChange('yearsInBusiness', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span>{profileData.yearsInBusiness} years</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              {isEditing ? (
                <textarea
                  value={editData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              ) : (
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <span>{profileData.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Specializations */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Specializations</h3>
            {isEditing ? (
              <div className="space-y-3">
                {editData.specializations.map((spec, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={spec}
                      onChange={(e) => handleSpecializationChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter specialization"
                    />
                    <button
                      onClick={() => removeSpecialization(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addSpecialization}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  + Add Specialization
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profileData.specializations.map((spec, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Business Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Description</h3>
            {isEditing ? (
              <textarea
                value={editData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Describe your business and services..."
              />
            ) : (
              <p className="text-gray-600">{profileData.description}</p>
            )}
          </div>

          {/* Business Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Radius</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.deliveryRadius}
                    onChange={(e) => handleInputChange('deliveryRadius', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                ) : (
                  <span className="text-gray-600">{profileData.deliveryRadius}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.minimumOrder}
                    onChange={(e) => handleInputChange('minimumOrder', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                ) : (
                  <span className="text-gray-600">{profileData.minimumOrder}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.certifications.join(', ')}
                    onChange={(e) => handleInputChange('certifications', e.target.value.split(', '))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter certifications separated by commas"
                  />
                ) : (
                  <div className="space-y-1">
                    {profileData.certifications.map((cert, index) => (
                      <span key={index} className="block text-sm text-gray-600">
                        • {cert}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Working Hours</h3>
            {isEditing ? (
              <textarea
                value={editData.workingHours}
                onChange={(e) => handleInputChange('workingHours', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your working hours..."
              />
            ) : (
              <div className="whitespace-pre-line text-gray-600">{profileData.workingHours}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;