const express = require('express');
const router = express.Router();
const {
  submitApplication,
  processApplication,
  deleteUnpaidApplications
} = require('../controllers/studentApplicationController');

// Route to submit an application
router.post('/apply', submitApplication);

// Route to process an application after fee payment
router.put('/process/:rollNo', processApplication);

// Route to automatically delete unpaid applications
router.delete('/cleanup', deleteUnpaidApplications);

module.exports = router;
