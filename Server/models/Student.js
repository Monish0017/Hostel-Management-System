const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  rollNo: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String,
    required: true
  },
  programme: {
    type: String,
    required: true
  },
  classYear: {
    type: String,
    required: true
  },
  fatherName: {
    type: String,
    required: true
  },
  residentialAddress: {
    type: String,
    required: true
  },
  primaryMobileNumber: {
    type: String,
    required: true
  },
  secondaryMobileNumber: {
    type: String,
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending'
  }
});

module.exports = mongoose.model('Student', studentSchema);
