// models/Complaint.js
const mongoose = require('mongoose');

const Complaint = new mongoose.Schema({
  studentRollNo: {
    type: String,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  complaintText: {
    type: String,
    required: true,
  },
  dateSubmitted: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Pending', 'Resolved'],
    default: 'Pending',
  },
});

module.exports = mongoose.model('Complaint', Complaint);
