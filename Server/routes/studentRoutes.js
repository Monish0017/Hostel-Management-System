const express = require('express');
const router = express.Router();
const { 
  getStudentProfile, 
  getStudentComplaints, 
  submitComplaint,
  forgotPassword, 
  resetPassword 
} = require('../controllers/studentControllers');
const auth = require('../middleware/auth');

// Route to get student profile
router.get('/profile', auth, getStudentProfile);

// Route to submit a complaint
router.post('/submit', auth, submitComplaint);

// Route to get student's own complaints
router.get('/my-complaints', auth, getStudentComplaints);

// Route for forgot password - no auth needed
router.post('/forgot-password', forgotPassword);

// Route for reset password using token - no auth needed
router.post('/reset-password/:token', resetPassword);

module.exports = router;

