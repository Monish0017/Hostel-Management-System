const express = require('express');
const router = express.Router();
const { getStudentProfile , getStudentComplaints , submitComplaint} = require('../controllers/studentControllers');
const auth = require('../middleware/auth');

// Route to get student profile
router.get('/profile', auth, getStudentProfile);
router.post('/submit', auth , submitComplaint);
router.get('/my-complaints' , auth , getStudentComplaints);

module.exports = router;
