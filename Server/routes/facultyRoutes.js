const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyControllers');

router.post('/', facultyController.addFaculty);
router.get('/', facultyController.getFaculty);

module.exports = router;
