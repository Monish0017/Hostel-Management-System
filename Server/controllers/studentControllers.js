const Student = require('../models/Student');
const Room = require('../models/Room');

exports.addStudent = async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getStudents = async (req, res) => {
    try {
        const students = await Student.find().populate('room');
        res.status(200).json(students);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Additional CRUD operations can be added similarly
