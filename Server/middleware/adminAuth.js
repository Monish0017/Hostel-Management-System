const jwt = require('jsonwebtoken');

const adminAuth = async (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure the token contains admin details
    if (!decoded.admin) {
      return res.status(403).json({ msg: 'Access denied, not an admin' });
    }

    req.admin = decoded.admin;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = adminAuth;
