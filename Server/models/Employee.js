const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  address: {
    type: String,
    required: true,
  },
  contactPhone: {
    type: String,
    required: true,
  },
  position: {  // Added position field
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  image: {  // Added image field
    type: String,  // You can use String to store image URL
    required: false, // Set to true if the image is mandatory
  },
});

// Export the model
module.exports = mongoose.model('Employee', EmployeeSchema);
