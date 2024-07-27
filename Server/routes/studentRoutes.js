const express = require('express');
const { addStudentProfile, getStudentProfile, getStudentProfiles } = require('../controllers/studentControllers');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', addStudentProfile);
router.get('/profile', auth, getStudentProfile);
router.get('/profiles', getStudentProfiles); // New route to fetch all student profiles

module.exports = router;
