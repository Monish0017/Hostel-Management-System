// utils/jwt.js
const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
  const payload = {
    user: {
      id: user._id,
      rollNo: user.rollNo
    }
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};
