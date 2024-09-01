const express = require('express');
const router = express.Router();
const foodItemControllers = require('../controllers/foodItemController'); // Ensure this path is correct
const foodTokenControllers = require('../controllers/foodTokenController'); // Ensure this path is correct
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/adminAuth');
const upload = require('../middleware/upload');

// Admin routes for Food Items
router.post('/admin/food-item', upload.single('image'), authAdmin, foodItemControllers.addFoodItem);
router.delete('/admin/food-item/:id', authAdmin, foodItemControllers.deleteFoodItem);
router.get('/admin/food-items', authAdmin, foodItemControllers.getAllFoodItems);

// Student routes for Food Tokens
router.post('/student/food-token', auth, foodTokenControllers.bookFoodToken);
router.delete('/student/food-token/:tokenId', auth, foodTokenControllers.cancelFoodToken);
router.get('/student/food-token/:tokenId/qrcode', auth, foodTokenControllers.generateQRCode);
router.get('/student/food-items', auth, foodItemControllers.getAllFoodItems);
router.get('/student/tokens', auth, foodTokenControllers.getStudentTokens);

// Utility route (may be set as a cron job)
router.delete('/cleanup-expired-tokens', authAdmin, foodTokenControllers.cleanupExpiredTokens);

//Admin token validation
router.post('/admin/food-token/validate', auth, foodTokenControllers.adminValidateToken);

module.exports = router;
