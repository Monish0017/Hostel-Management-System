const express = require('express');
const { addApplication } = require('../controllers/applicationControllers');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/apply', auth, addApplication);

module.exports = router;
