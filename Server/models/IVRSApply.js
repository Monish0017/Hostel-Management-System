const mongoose = require('mongoose');

const IVRSApply = new mongoose.Schema({
    studentRollNo: {
        type: String,
        required: true
    },
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Pending'
    },
    callCount: { // New field to track the number of calls made
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('IVRSApply', IVRSApply);