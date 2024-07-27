const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Route for students to submit payments
router.post('/submit-payment', paymentController.submitPayment);

module.exports = router;