const express = require('express');
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  allocateRooms,
  assignRoom,
  removeStudentFromRoom,
  addStudent,
  modifyStudent,
  removeStudent
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/adminauth');

// Register a new admin
router.post('/register', registerAdmin);

// Admin login
router.post('/login', loginAdmin);

// Allocate rooms
router.post('/allocate-rooms', authMiddleware, allocateRooms);

// Assign a student to a room
router.post('/assign-room', authMiddleware, assignRoom);

// Remove a student from a room
router.post('/remove-student-from-room', authMiddleware, removeStudentFromRoom);

// Add a new student
router.post('/add-student', authMiddleware, addStudent);

// Modify an existing student
router.put('/modify-student/:rollNo', authMiddleware, modifyStudent);

// Remove a student
router.delete('/remove-student/:rollNo', authMiddleware, removeStudent);

module.exports = router;
