const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number},
    gender: { type: String},
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null }
});

module.exports = mongoose.model('Student', StudentSchema);
