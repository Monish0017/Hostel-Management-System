const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  studentrollNo: {
    type: String,
    ref: 'Student',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
