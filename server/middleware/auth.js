import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  console.log('Auth headers:', req.headers);
  
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  console.log('Auth header:', authHeader);
  
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  console.log('Extracted token:', token);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token tidak ditemukan'
    });
  }

  try {
    console.log('Verifying token with secret:', process.env.JWT_SECRET ? 'Secret exists' : 'Using default secret');
    
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Decoded token:', decoded);
    
    // Add the user information to the request object
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role
    };
    
    console.log('User set in request:', req.user);

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token telah kedaluwarsa'
      });
    }
    
    return res.status(403).json({
      success: false,
      message: 'Token tidak valid'
    });
  }
};

export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - No user found'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - Insufficient permissions'
      });
    }

    next();
  };
};