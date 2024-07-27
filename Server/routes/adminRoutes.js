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
  removeStudent,
  getAllStudents,
  getStudentByRollNo,
  getStudentPayments,
  getAllApplications
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/adminAuth');

// Admin authentication routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Room allocation route
router.post('/allocate-rooms', authMiddleware, allocateRooms);

// Room management routes
router.post('/assign-room', authMiddleware, assignRoom);
router.post('/remove-student-from-room', authMiddleware, removeStudentFromRoom);

// Student management routes
router.post('/add-student', authMiddleware, addStudent);
router.put('/modify-student/:rollNo', authMiddleware, modifyStudent);
router.delete('/remove-student/:rollNo', authMiddleware, removeStudent);

// Student details routes
router.get('/students', authMiddleware, getAllStudents);
router.get('/students/:rollNo', authMiddleware, getStudentByRollNo);
router.get('/students/:rollNo/payments', authMiddleware, getStudentPayments);

// Application management routes
router.get('/applications', authMiddleware, getAllApplications);

module.exports = router;
