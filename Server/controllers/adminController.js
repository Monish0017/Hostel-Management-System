const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const RoomAllocator = require('../utils/allocation');
const Student = require('../models/Student');
const Room = require('../models/Room');
const Payment = require('../models/Payment');
const Application = require('../models/Application');

// Fetch all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({});
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Fetch student by roll number
const getStudentByRollNo = async (req, res) => {
  const { rollNo } = req.params;
  try {
    const student = await Student.findOne({ rollNo }).populate('room').populate('payments');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Fetch student payment details
const getStudentPayments = async (req, res) => {
  const { rollNo } = req.params;
  try {
    const student = await Student.findOne({ rollNo });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const payments = await Payment.find({ student: student._id });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Register a new admin
const registerAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ msg: 'Admin already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      email,
      password: hashedPassword
    });

    await newAdmin.save();
    res.status(201).json({ msg: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Admin login
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      admin: {
        id: admin.id
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Allocate rooms
const allocateRooms = async (req, res) => {
  try {
    await RoomAllocator.allocateRooms();
    res.status(200).send({ msg: 'Rooms allocated successfully' });
  } catch (error) {
    console.error('Error allocating rooms:', error);
    res.status(500).send({ error: 'Server error' });
  }
};

// Assign a student to a room
const assignRoom = async (req, res) => {
  const { studentRollNo, blockName, roomNo } = req.body;

  try {
    // Find the student
    const student = await Student.findOne({ rollNo: studentRollNo });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Find the room
    const room = await Room.findOne({ blockName, roomNo });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check room capacity
    if (room.students.length >= room.capacity) {
      return res.status(400).json({ message: 'Room is full' });
    }

    // Add student to the room
    room.students.push(student._id);
    await room.save();

    // Assign room to the student
    student.room = room._id;
    await student.save();

    res.status(200).json({ message: 'Student assigned to room successfully' });
  } catch (error) {
    console.error('Error assigning room:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Remove a student from a room
const removeStudentFromRoom = async (req, res) => {
  const { studentRollNo } = req.body;

  try {
    // Find the student
    const student = await Student.findOne({ rollNo: studentRollNo });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Find the room the student is currently assigned to
    const room = await Room.findById(student.room);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Remove student from the room
    room.students = room.students.filter(id => !id.equals(student._id));
    await room.save();

    // Remove room assignment from student
    student.room = null;
    await student.save();

    res.status(200).json({ message: 'Student removed from room successfully' });
  } catch (error) {
    console.error('Error removing student from room:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add a new student
const addStudent = async (req, res) => {
  const { fullName, email, password, rollNo, contactPhone, programme, classYear, fatherName, residentialAddress, primaryMobileNumber, secondaryMobileNumber } = req.body;

  try {
    const existingStudent = await Student.findOne({ rollNo });
    if (existingStudent) {
      return res.status(400).json({ msg: 'Student already exists' });
    }

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
    res.status(201).json({ msg: 'Student added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Modify an existing student
const modifyStudent = async (req, res) => {
  const { rollNo } = req.params;
  const updates = req.body;

  try {
    const student = await Student.findOneAndUpdate({ rollNo }, updates, { new: true });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student updated successfully', student });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Remove a student
const removeStudent = async (req, res) => {
  const { rollNo } = req.params;

  try {
    const student = await Student.findOneAndDelete({ rollNo });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Optionally: Remove student from their room
    if (student.room) {
      const room = await Room.findById(student.room);
      if (room) {
        room.students = room.students.filter(id => !id.equals(student._id));
        await room.save();
      }
    }

    res.status(200).json({ message: 'Student removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Fetch all applications
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find({});
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAllStudents,
  getStudentByRollNo,
  getStudentPayments,
  removeStudentFromRoom,
  assignRoom,
  addStudent,
  removeStudent,
  modifyStudent,
  getAllApplications,
  allocateRooms
};
