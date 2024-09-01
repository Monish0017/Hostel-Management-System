// models/FoodToken.js
const mongoose = require('mongoose');

const foodTokenSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    foodItemName: { // Change from foodItem (ObjectId) to foodItemName (String)
        type: String,
        required: true,
    },
    bookingDate: {
        type: Date,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('FoodToken', foodTokenSchema);
