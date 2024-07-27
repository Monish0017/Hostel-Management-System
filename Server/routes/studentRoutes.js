const express = require('express');
const router = express.Router();
const { getStudentProfile } = require('../controllers/studentController');
const auth = require('../middleware/auth');

// Route to get student profile
router.get('/profile', auth, getStudentProfile);

module.exports = router;
