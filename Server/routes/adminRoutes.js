const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const {
  registerAdmin,
  loginAdmin,
  allocateRooms,
  manualAssignStudentToRoom,
  removeStudentFromRoom,
  modifyStudent,
  removeStudent,
  getAllStudents,
  getStudentPayments,
  getAllApplications,
  deleteAllStudents,
  getAllRooms,
  deleteRoom,
  vacateAllRooms,
  addRoom,
  getRoomDetailsWithStudents,
  uploadStudents
} = require('../controllers/adminController');

const authMiddleware = require('../middleware/adminAuth');

// Admin authentication routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Room allocation route
router.post('/allocate-rooms', authMiddleware, allocateRooms);

// Room management routes
router.post('/assign-room', authMiddleware, manualAssignStudentToRoom);
router.post('/remove-student-from-room', authMiddleware, removeStudentFromRoom);
router.get('/rooms', authMiddleware, getAllRooms);
router.post('/rooms/vacate-all', authMiddleware, vacateAllRooms); 
router.delete('/rooms/:roomId', authMiddleware, deleteRoom);
router.post('/add-room', authMiddleware, addRoom);
router.get('/roomdetails' , authMiddleware , getRoomDetailsWithStudents);

// Route for uploading students
router.post('/add-students', upload.single('file'), uploadStudents);
router.put('/modify-student/:rollNo', authMiddleware, modifyStudent);
router.delete('/remove-student/:rollNo', authMiddleware, removeStudent);
router.delete('/students', authMiddleware, deleteAllStudents);

// Student details routes
router.get('/students', authMiddleware, getAllStudents);
router.get('/students/:rollNo/payments', authMiddleware, getStudentPayments);

// Application management routes
router.get('/applications', authMiddleware, getAllApplications);

module.exports = router;
