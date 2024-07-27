const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const Student = require('../models/Student');

// Function to get a student profile
const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-password');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getStudentProfiles = async (req, res) => {
  try {
    const students = await Student.find().select('fullName');
    res.json(students);
  } catch (error) {
    console.error('Error fetching student profiles:', error);
    res.status(500).send({ error: 'Server error' });
  }
};

// Function to add a student profile
const addStudentProfile = async (req, res) => {
  const { fullName, email, password, rollNo, contactPhone, programme, classYear, fatherName, residentialAddress, primaryMobileNumber, secondaryMobileNumber } = req.body;

  try {
    // Check if the student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ msg: 'Student already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStudent = new Student({
      fullName,
      email,
      password: hashedPassword,
      rollNo,
      contactPhone,
      programme,
      classYear,
      fatherName,
      residentialAddress,
      primaryMobileNumber,
      secondaryMobileNumber
    });

    await newStudent.save();

    // Generate token
    const token = generateToken(newStudent);

    res.status(201).json({ msg: 'Student profile added successfully', token });
  } catch (error) {
    console.error('Error adding student profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getStudentProfile,
  addStudentProfile,
  getStudentProfiles
};
