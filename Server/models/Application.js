const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentRollNo: {
    type: String,
    required: true
  },
  preferredRoommatesRollNos: [{
    type: String
  }],
  roomType: {
    type: Number,
    required: true
  },
  blockName: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Application', applicationSchema);
