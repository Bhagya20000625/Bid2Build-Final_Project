# Registration System Backend

A Node.js backend API for a multi-role registration system supporting Customers, Constructors, Suppliers, and Architects.

## Features

- **Multi-role Registration**: Support for 4 different user types
- **File Upload**: Document upload with validation
- **Data Validation**: Server-side validation matching frontend
- **MySQL Database**: Relational database with proper schema design
- **Security**: Password hashing with bcrypt
- **Error Handling**: Comprehensive error handling and validation

## Prerequisites

- Node.js (v14 or higher)
- MySQL (via WAMP server)
- npm

## Database Setup

1. Start your WAMP server
2. Open phpMyAdmin (http://localhost/phpmyadmin)
3. Run the following SQL script to create the database:

```sql
-- Create the database
CREATE DATABASE IF NOT EXISTS registration_system;
USE registration_system;

-- Main users table (common data for all user types)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(254) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_role ENUM('customer', 'constructor', 'supplier', 'architect') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE
);

-- Customer-specific data
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    location VARCHAR(255),
    preferred_project_type ENUM('residential', 'commercial', 'renovation', 'other'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Constructor-specific data
CREATE TABLE constructors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    company_name VARCHAR(255),
    specialization ENUM('civil', 'electrical', 'plumbing', 'carpentry', 'roofing', 'other') NOT NULL,
    years_experience INT NOT NULL,
    license_number VARCHAR(100) NOT NULL,
    portfolio_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Supplier-specific data
CREATE TABLE suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    business_reg_number VARCHAR(100) NOT NULL,
    service_area VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Materials supplied by suppliers
CREATE TABLE supplier_materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT NOT NULL,
    material VARCHAR(100) NOT NULL,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
);

-- Architect-specific data
CREATE TABLE architects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    specialization ENUM('residential', 'commercial', 'interior', 'landscape', 'urban-planning', 'sustainable', 'other') NOT NULL,
    years_experience INT NOT NULL,
    portfolio_url VARCHAR(500),
    design_software VARCHAR(500),
    license_number VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Document uploads table
CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Installation

1. Clone or download the backend files
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env` file and update database credentials if needed
   - Default configuration works with standard WAMP setup

## Configuration

Update the `.env` file with your database configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=registration_system
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# File Upload Configuration
MAX_FILE_SIZE=5000000
UPLOAD_PATH=./uploads
```

## Running the Server

### Development Mode (with auto-restart):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will run on http://localhost:5000

## API Endpoints

### Registration
- **POST** `/api/auth/register`
  - Register a new user with role-specific data
  - Supports file uploads for documents
  - Content-Type: multipart/form-data

### User Management
- **GET** `/api/auth/user/:email` - Get user by email
- **GET** `/api/auth/profile/:userId` - Get complete user profile

### Health Check
- **GET** `/api/health` - Server health status
- **GET** `/` - API documentation

## Request Format

### Registration Request (Form Data)

**Common Fields (All User Types):**
- email
- firstName
- lastName
- phone
- password
- confirmPassword
- userRole ('customer', 'constructor', 'supplier', 'architect')

**Customer-Specific Fields:**
- location (optional)
- preferredProjectType (optional)
- document (file, optional)

**Constructor-Specific Fields:**
- companyName (optional)
- specialization (required)
- yearsExperience (required)
- licenseNumber (required)
- portfolioUrl (optional)
- businessCertificate (file, required)
- relevantLicenses (file, required)

**Supplier-Specific Fields:**
- businessName (required)
- materialsSupplied (array)
- businessRegNumber (required)
- serviceArea (required)
- registrationCertificate (file, required)
- catalogFile (file, optional)

**Architect-Specific Fields:**
- specialization (required)
- yearsExperience (required)
- portfolioUrl (optional)
- designSoftware (optional)
- licenseNumber (required)
- professionalLicense (file, required)

## File Uploads

- **Supported formats**: PDF, JPEG, JPG, PNG
- **Max file size**: 5MB
- **Upload directory**: `./uploads/`
- **Access uploaded files**: `GET /uploads/filename`

## Validation

- Email format validation (RFC compliant)
- Password strength validation
- File type and size validation
- Role-specific required field validation
- SQL injection prevention

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error array"]
}
```

## Success Responses

Registration success:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": 123,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "userRole": "customer"
  }
}
```

## Frontend Integration

Configure your frontend to send requests to:
- Development: `http://localhost:5000/api/auth/register`
- Update CORS origins in `server.js` if using different ports

## Troubleshooting

1. **Database Connection Issues:**
   - Ensure WAMP server is running
   - Check database credentials in `.env`
   - Verify database exists

2. **File Upload Issues:**
   - Check uploads directory permissions
   - Verify file size limits
   - Ensure supported file formats

3. **CORS Issues:**
   - Add your frontend URL to CORS configuration in `server.js`

## Project Structure

```
Backend/
├── config/
│   └── database.js          # Database connection
├── controllers/
│   └── registrationController.js  # Registration logic
├── middleware/
│   ├── validation.js        # Validation functions
│   └── upload.js           # File upload handling
├── routes/
│   └── auth.js             # Authentication routes
├── uploads/                # File uploads directory
├── .env                    # Environment variables
├── server.js               # Main server file
├── package.json            # Dependencies
└── README.md              # This file
```