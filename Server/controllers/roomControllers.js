const Room = require('../models/Room');

exports.addRoom = async (req, res) => {
    try {
        const room = new Room(req.body);
        await room.save();
        res.status(201).json(room);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getRooms = async (req, res) => {
    try {
        const rooms = await Room.find().populate('students');
        res.status(200).json(rooms);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Additional CRUD operations can be added similarly
