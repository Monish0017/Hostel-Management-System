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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'  // Reference to Student schema
  }]
});

module.exports = mongoose.model('Room', roomSchema);
