const Food = require('../models/Food');

exports.addFood = async (req, res) => {
    try {
        const food = new Food(req.body);
        await food.save();
        res.status(201).json(food);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getFood = async (req, res) => {
    try {
        const food = await Food.find();
        res.status(200).json(food);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Additional CRUD operations can be added similarly
