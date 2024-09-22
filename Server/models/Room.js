const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  hostelName: {
    type: String,
    required: true
  },
  blockName: {
    type: String,
    required: true
  },
  roomType: {
    type: String,
    required: true
  },
  floor: {
    type: String,
    required: true
  },
  roomNo: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  students: [{
    type: String,  // Change to String to store rollNo
    ref: 'Student' // You can still keep the ref if needed for population
  }]
});

module.exports = mongoose.model('Room', roomSchema);
