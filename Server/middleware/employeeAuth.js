const jwt = require('jsonwebtoken');

const employeeAuth = (req, res, next) => {
  // Get the token from the request header (custom header 'x-auth-token')
  const token = req.header('x-auth-token');

  // If no token is provided, deny access
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify the token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure the token contains employee details
    if (!decoded || !decoded.employeeId) {
      return res.status(403).json({ msg: 'Access denied, not an employee' });
    }

    // Attach employee information to the request object
    req.employee = { id: decoded.employeeId, email: decoded.email };

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // If token verification fails, send a response
    console.error('Token verification error:', err); // Log the error for debugging
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = employeeAuth;
