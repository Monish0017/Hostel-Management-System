const Faculty = require('../models/Faculty');

exports.addFaculty = async (req, res) => {
    try {
        const faculty = new Faculty(req.body);
        await faculty.save();
        res.status(201).json(faculty);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

exports.getFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.find();
        res.status(200).json(faculty);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Additional CRUD operations can be added similarly

exports.getFacultyById = async (req, res) => {
    try {
        const faculty = await Faculty.findById(req.params.id);
        res.status(200).json(faculty);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
