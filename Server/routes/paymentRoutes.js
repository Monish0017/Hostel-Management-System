const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// // Route for students to submit payments
// router.post('/submit-payment', paymentController.submitPayment);

router.post('/submit-payment' , paymentController.submitPaymentInitial);

module.exports = router;
