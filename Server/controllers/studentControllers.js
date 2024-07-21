const Profile = require('../models/Student');
const bcrypt = require('bcryptjs');

// Function to add a new student profile
const addStudentProfile = async (req, res) => {
  const { password, ...rest } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 8);
    const student = new Profile({ ...rest, password: hashedPassword });
    await student.save();
    res.status(201).send(student);
  } catch (error) {
    res.status(400).send({ error: 'Failed to create student profile' });
  }
};

// Function to get student profile using token
const getStudentProfile = async (req, res) => {
  try {
    // Use userId from the token
    const student = await Profile.findOne({ _id: req.userId });
    if (!student) {
      return res.status(404).send({ error: 'Student not found' });
    }
    res.send(student);
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
};

module.exports = {
  addStudentProfile,
  getStudentProfile
};
