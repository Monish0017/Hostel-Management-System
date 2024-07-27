const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/adminAuth')
const upload = require('../middleware/upload')

// Admin routes

router.post('/admin/food', upload.single('image'),authAdmin , foodController.addFoodItem);
router.delete('/admin/food/:id', authAdmin , foodController.deleteFoodItem);
router.get('/admin/food-tokens', authAdmin , foodController.getAllFoodTokens);
router.delete('/admin/food-token/:id', authAdmin , foodController.deleteFoodToken);

// Student routes
router.post('/student/book-food-token', auth , foodController.bookFoodToken);

module.exports = router;
