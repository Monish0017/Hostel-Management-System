const express = require('express');
const { addStudentProfile, getStudentProfile } = require('../controllers/studentControllers');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', addStudentProfile);
router.get('/profile', auth, getStudentProfile);

module.exports = router;
