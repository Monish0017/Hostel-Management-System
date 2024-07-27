const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String, // URL to the image of the food item
    required: true,
  },
  availableDays: {
    type: [String], // Array of days when the food item is available
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
});

module.exports = mongoose.model('FoodItem', foodItemSchema);
