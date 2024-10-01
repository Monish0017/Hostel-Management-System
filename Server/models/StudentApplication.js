const mongoose = require('mongoose');

const studentApplicationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
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
    type: String
  },
  secondaryMobileNumber: {
    type: String
  },
  paymentStatus: {
    type: Boolean,
    default: false // This will track if the payment has been made or not
  }
}, { timestamps: true });

module.exports = mongoose.model('StudentApplication', studentApplicationSchema);
