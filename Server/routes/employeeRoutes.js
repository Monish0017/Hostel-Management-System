// routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const employeeAuthController = require('../controllers/employeeController');
const employeeAuthMiddleware = require('../middleware/employeeAuth'); // Assuming this middleware checks JWT tokens for employee authentication

// Employee login route
router.post('/login', employeeAuthController.loginEmployee);

// Route to clear food tokens (requires authentication)
router.post('/clear-token', employeeAuthMiddleware, employeeAuthController.clearTokens);

// Route to scan QR coscan-qrde and issue food (requires authentication)
router.post('/scan-qr', employeeAuthMiddleware, employeeAuthController.scanQrAndIssueFood);

module.exports = router;
