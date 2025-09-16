import React from 'react';
import { CheckCircle, Home, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SuccessPage({ userRole, onStartOver }) {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Construction background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white bg-opacity-90"></div>
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 relative z-10 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Registration Complete!
        </h1>

        <p className="text-gray-600 mb-6">
          Welcome to our platform! Your {userRole.toLowerCase()} account has been successfully created.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">What's Next?</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-3 text-purple-600" />
              <span>Check your email for verification</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-3 text-purple-600" />
              <span>Complete your profile setup</span>
            </div>
            <div className="flex items-center">
              <Home className="w-4 h-4 mr-3 text-purple-600" />
              <span>Start connecting with professionals</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={handleGoToDashboard}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 focus:ring-4 focus:ring-purple-300 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Go to Login
          </button>
          
          <button
            onClick={onStartOver}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 transition-all duration-200"
          >
            Register Another Account
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Need help? Contact our support team at support@platform.com
        </p>
      </div>
    </div>
  );
}