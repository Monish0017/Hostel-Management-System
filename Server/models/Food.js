const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    meal: { type: String, required: true },
    items: [String]
});

module.exports = mongoose.model('Food', FoodSchema);
