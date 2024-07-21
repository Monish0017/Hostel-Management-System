const express = require('express');
const { login } = require('../controllers/authControllers');

const router = express.Router();

// @route   POST /auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', login);

module.exports = router;
