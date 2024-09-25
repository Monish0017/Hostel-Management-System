const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  
  // Check if token is present
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Decode the token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ensure that the token contains the correct `user` object with the student role
    if (!decoded.user) {
      return res.status(403).json({ message: 'Access denied, only students can access this resource' });
    }

    // Attach the user object to the request (can include `rollNo` and other details if needed)
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token is not valid' });
  }
};
