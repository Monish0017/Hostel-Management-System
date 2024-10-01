const express = require('express');
const router = express.Router();
const adminauth = require('../middleware/adminAuth');
const upload = require('../middleware/upload');

const {
  submitApplication,
  processApplication,
  deleteUnpaidApplications,
  getAllApplications
} = require('../controllers/studentApplicationController');

// Route to submit an application
router.post('/apply', upload.single('image') , submitApplication);

router.get('/getstudent' , adminauth , getAllApplications);

// Route to process an application after fee payment
router.post('/process', adminauth ,processApplication);

// Route to automatically delete unpaid applications
router.delete('/cleanup', adminauth , deleteUnpaidApplications);

module.exports = router;
