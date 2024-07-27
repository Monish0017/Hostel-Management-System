const mongoose = require('mongoose');

const foodTokenSchema = new mongoose.Schema({
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    foodItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodItem',
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
    status: {
      type: String,
      enum: ['pending', 'issued'],
      default: 'pending',
    },
  });
  
  module.exports = mongoose.model('FoodToken', foodTokenSchema);
  