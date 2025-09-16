import React, { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import CustomerForm from './CustomerForm';
import ConstructorForm from './ConstructorForm';
import SupplierForm from './SupplierForm';
import ArchitectForm from './ArchitectForm';
import SuccessPage from './SuccessPage';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [currentStep, setCurrentStep] = useState('initial');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userRole: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [emailErrors, setEmailErrors] = useState([]);
  const [emailTouched, setEmailTouched] = useState(false);
  
  const navigate = useNavigate();

  // Email validation function
  const validateEmail = (email) => {
    // Check total length
    if (email.length > 254) {
      return false;
    }
    
    // Check for spaces
    if (/\s/.test(email)) {
      return false;
    }
    
    // Check for exactly one @ symbol
    const atCount = (email.match(/@/g) || []).length;
    if (atCount !== 1) {
      return false;
    }
    
    const [localPart, domainPart] = email.split('@');
    
    // Check local part length
    if (localPart.length > 64) {
      return false;
    }
    
    // Check local part is not empty
    if (localPart.length === 0) {
      return false;
    }
    
    // Check valid characters in local part (letters, numbers, ., _, -, +)
    if (!/^[a-zA-Z0-9._+-]+$/.test(localPart)) {
      return false;
    }
    
    // Check domain part is not empty
    if (!domainPart || domainPart.length === 0) {
      return false;
    }
    
    // Check domain contains at least one dot
    if (!domainPart.includes('.')) {
      return false;
    }
    
    // Check valid characters in domain (letters, numbers, -, .)
    if (!/^[a-zA-Z0-9.-]+$/.test(domainPart)) {
      return false;
    }
    
    // Check top-level domain (after last dot) has at least 2 characters
    const lastDotIndex = domainPart.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      const tld = domainPart.substring(lastDotIndex + 1);
      if (tld.length < 2) {
        return false;
      }
      // Check TLD contains only letters
      if (!/^[a-zA-Z]+$/.test(tld)) {
        return false;
      }
    }
    
    // Check domain doesn't start or end with hyphen or dot
    if (domainPart.startsWith('-') || domainPart.endsWith('-') || 
        domainPart.startsWith('.') || domainPart.endsWith('.')) {
      return false;
    }
    
    // Check for consecutive dots
    if (domainPart.includes('..')) {
      return false;
    }
    
    return true;
  };

  const handleEmailBlur = () => {
    const isValid = validateEmail(formData.email.toLowerCase());
    setEmailErrors(isValid ? [] : ['Please enter a valid email']);
    setEmailTouched(true);
  };

  // Password validation function
  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('At least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('At least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('At least one lowercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('At least one number');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('At least one special character');
    }
    
    return errors;
  };

  // Check if password requirements are met
  const getPasswordRequirements = (password) => {
    return [
      { text: 'At least 8 characters', met: password.length >= 8 },
      { text: 'At least one uppercase letter', met: /[A-Z]/.test(password) },
      { text: 'At least one lowercase letter', met: /[a-z]/.test(password) },
      { text: 'At least one number', met: /\d/.test(password) },
      { text: 'At least one special character', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) }
    ];
  };

  const handlePasswordBlur = () => {
    setPasswordErrors(validatePassword(formData.password));
    setPasswordTouched(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") { // match your input's name
      let digitsOnly = value.replace(/\D/g, '');
      digitsOnly = digitsOnly.slice(0, 10);

      let formattedValue = digitsOnly;
      if (digitsOnly.length > 3 && digitsOnly.length <= 6) {
        formattedValue = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
      } else if (digitsOnly.length > 6) {
        formattedValue = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
      }

      setFormData({ ...formData, [name]: formattedValue });
    } else if (name === 'password') {
      setFormData({ ...formData, [name]: value });
      if (passwordTouched) {
        setPasswordErrors(validatePassword(value));
      }
    } else if (name === 'email') {
      setFormData({ ...formData, [name]: value.toLowerCase() });
      if (emailTouched) {
        const isValid = validateEmail(value.toLowerCase());
        setEmailErrors(isValid ? [] : ['Please enter a valid email']);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate email before submission
    const isEmailValid = validateEmail(formData.email);
    if (!isEmailValid) {
      setEmailTouched(true);
      setEmailErrors(['Please enter a valid email']);
      return;
    }
    
    // Validate password before submission
    const passwordValidationErrors = validatePassword(formData.password);
    if (passwordValidationErrors.length > 0) {
      setPasswordTouched(true);
      setPasswordErrors(passwordValidationErrors);
      return;
    }
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match. Please check and try again.');
      return;
    }

    if (formData.userRole) {
      setCurrentStep('roleSpecific');
    }
  };

  const handleRoleSpecificSubmit = async (roleData) => {
    try {
      // Prepare the complete registration data
      const registrationData = {
        // Basic user info
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        userRole: formData.userRole,
        // Role-specific data
        ...roleData
      };

      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Add basic fields
      Object.keys(registrationData).forEach(key => {
        if (key !== 'files' && registrationData[key] !== null && registrationData[key] !== undefined) {
          formDataToSend.append(key, registrationData[key]);
        }
      });

      // Add files if present
      if (roleData.document) {
        formDataToSend.append('document', roleData.document);
      }
      if (roleData.businessCertificate) {
        formDataToSend.append('businessCertificate', roleData.businessCertificate);
      }
      if (roleData.relevantLicenses) {
        formDataToSend.append('relevantLicenses', roleData.relevantLicenses);
      }
      if (roleData.registrationCertificate) {
        formDataToSend.append('registrationCertificate', roleData.registrationCertificate);
      }
      if (roleData.catalogFile) {
        formDataToSend.append('catalogFile', roleData.catalogFile);
      }
      if (roleData.professionalLicense) {
        formDataToSend.append('professionalLicense', roleData.professionalLicense);
      }

      // Send to backend
      console.log('Sending request to backend...');
      console.log('FormData contents:', Object.fromEntries(formDataToSend));
      
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        body: formDataToSend
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('Registration successful:', result);
        setCurrentStep('success');
      } else {
        console.error('Registration failed:', result);
        alert(`Registration failed: ${result.message || 'Unknown error'}`);
        if (result.errors) {
          console.error('Validation errors:', result.errors);
          alert('Validation errors: ' + result.errors.join(', '));
        }
      }

    } catch (error) {
      console.error('Network error:', error);
      alert('Network error occurred. Please check if the backend server is running.');
    }
  };

  const handleBack = () => {
    setCurrentStep('initial');
  };

  const handleStartOver = () => {
    setCurrentStep('initial');
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      confirmPassword: '',
      userRole: ''
    });
    setShowConfirmPassword(false);
    setShowPassword(false);
    setPasswordErrors([]);
    setPasswordTouched(false);
    setEmailErrors([]);
    setEmailTouched(false);
  };

  // Show success page
  if (currentStep === 'success') {
    return <SuccessPage userRole={formData.userRole} onStartOver={handleStartOver} />;
  }

  // Show role-specific form
  if (currentStep === 'roleSpecific') {
    const formProps = { onBack: handleBack, onSubmit: handleRoleSpecificSubmit };
    
    const FormWrapper = ({ children }) => (
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Construction background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white bg-opacity-90"></div>
        </div>
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 relative z-10">
          {children}
        </div>
      </div>
    );

    switch (formData.userRole) {
      case 'Customer':
        return <FormWrapper><CustomerForm {...formProps} /></FormWrapper>;
      case 'Constructor':
        return <FormWrapper><ConstructorForm {...formProps} /></FormWrapper>;
      case 'Supplier':
        return <FormWrapper><SupplierForm {...formProps} /></FormWrapper>;
      case 'Architect':
        return <FormWrapper><ArchitectForm {...formProps} /></FormWrapper>;
      default:
        return null;
    }
  }

  const passwordsDontMatch = formData.confirmPassword && formData.password !== formData.confirmPassword;
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
  const passwordRequirements = getPasswordRequirements(formData.password);

  // Show initial registration form
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
      
      <div className="flex max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left side - Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 relative z-10">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Create an account</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">
                  Email Address
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleEmailBlur}
                  placeholder="Enter your email address"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                    emailTouched && emailErrors.length > 0 
                      ? 'border-red-300 focus:ring-red-500' 
                      : emailTouched && emailErrors.length === 0 && formData.email
                      ? 'border-green-300 focus:ring-green-500'
                      : 'border-gray-200 focus:ring-purple-500'
                  }`}
                  required
                />
                
                {/* Email Validation Feedback */}
                {emailTouched && (
                  <div className="mt-2">
                    {emailErrors.length === 0 && formData.email ? (
                      <div className="flex items-center space-x-2">
                        <Check size={16} className="text-green-500" />
                        <span className="text-sm text-green-600">Valid email address</span>
                      </div>
                    ) : emailErrors.length > 0 ? (
                      <div className="flex items-center space-x-2">
                        <X size={16} className="text-red-500" />
                        <span className="text-sm text-red-600">Please enter a valid email</span>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* First Name and Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-600 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-600 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your Phone Number"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handlePasswordBlur}
                    placeholder="Enter your Password"
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                      passwordTouched && passwordErrors.length > 0 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-200 focus:ring-purple-500'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                {/* Password Requirements */}
                {(passwordTouched || formData.password) && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-medium text-gray-600">Password requirements:</p>
                    <div className="space-y-1">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          {req.met ? (
                            <Check size={16} className="text-green-500" />
                          ) : (
                            <X size={16} className="text-red-500" />
                          )}
                          <span className={`text-sm ${req.met ? 'text-green-600' : 'text-red-600'}`}>
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Enter your Confirm Password"
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                      passwordsDontMatch 
                        ? 'border-red-300 focus:ring-red-500' 
                        : passwordsMatch 
                        ? 'border-green-300 focus:ring-green-500'
                        : 'border-gray-200 focus:ring-purple-500'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className="mt-2 flex items-center space-x-2">
                    {passwordsMatch ? (
                      <>
                        <Check size={16} className="text-green-500" />
                        <span className="text-sm text-green-600">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <X size={16} className="text-red-500" />
                        <span className="text-sm text-red-600">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Select User Role */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-4">
                  Select User Role
                </label>
                <div className="space-y-3">
                  {['Customer', 'Constructor', 'Supplier', 'Architect'].map((role) => (
                    <label key={role} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="userRole"
                        value={role}
                        checked={formData.userRole === role}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        required
                      />
                      <span className="ml-3 text-gray-700 group-hover:text-purple-600 transition-colors duration-200">
                        {role}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-sky-500 hover:via-sky-600 hover:to-blue-700 focus:ring-4 focus:ring-sky-300 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Next
              </button>

              {/* Login Link */}
              <p className="text-center text-gray-600 mt-6">
                Already have an account?{' '}
                <button 
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
                >
                  Login
                </button>
              </p>
            </form>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 opacity-90"></div>
          <img
            src="https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Construction tools and blueprints"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4">Join Our Platform</h2>
              <p className="text-lg opacity-90">Connect with professionals in construction, architecture, and supply chain</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;