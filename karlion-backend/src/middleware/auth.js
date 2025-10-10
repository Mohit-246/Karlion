// middleware/auth.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// User roles
const ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

// Sign up middleware
const signUp = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, password, and name are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }

    // Password strength check
    if (password.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 8 characters long' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Attach processed data to request
    req.userData = {
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: ROLES.USER // Default role
    };

    next();
  } catch (error) {
    console.error('SignUp middleware error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error during sign up process' 
    });
  }
};

// Sign in middleware
const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    // Attach login data to request for controller to process
    req.loginData = {
      email: email.toLowerCase(),
      password
    };

    next();
  } catch (error) {
    console.error('SignIn middleware error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error during sign in process' 
    });
  }
};

// Verify JWT token
const verifyToken = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1] || req.headers['x-access-token'];

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};

// Check if user is authenticated
const isAuthenticated = verifyToken;

// Check if user is admin
const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required' 
      });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error verifying admin privileges' 
    });
  }
};

// Check if user has specific role
const hasRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Insufficient privileges' 
      });
    }

    next();
  };
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Verify password
const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  signUp,
  signIn,
  isAuthenticated,
  isAdmin,
  hasRole,
  generateToken,
  verifyPassword,
  ROLES
};