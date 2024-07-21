const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodControllers');

router.post('/', foodController.addFood);
router.get('/', foodController.getFood);

module.exports = router;
