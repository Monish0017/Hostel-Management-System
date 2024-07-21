const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const Profile = require('../models/Student');

exports.login = [
  // Validation
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      let user = await Profile.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      // Create JWT
      const payload = {
        user: {
          id: user.id
        }
      };

      const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
      const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

      res.json({ accessToken, refreshToken });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
];
