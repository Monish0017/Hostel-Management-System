// controllers/foodItemController.js
const FoodItem = require('../models/FoodItem');

// Add a food item (Admin)
exports.addFoodItem = async (req, res) => {
    try {
        const { name, availableDays } = req.body;
        const imagePath = req.file ? `/Assets/${req.file.originalname}` : null;

        if (!imagePath) {
            return res.status(400).json({ error: 'Image is required' });
        }

        const newFoodItem = new FoodItem({ name, image: imagePath, availableDays });
        await newFoodItem.save();
        res.status(201).json(newFoodItem);
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

// Delete a food item (Admin)
exports.deleteFoodItem = async (req, res) => {
    try {
        const { id } = req.params;
        await FoodItem.findByIdAndDelete(id);
        res.status(200).json({ message: 'Food item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Fetch all food items (Admin & Students)
exports.getAllFoodItems = async (req, res) => {
    try {
        const foodItems = await FoodItem.find({});
        res.status(200).json(foodItems);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
