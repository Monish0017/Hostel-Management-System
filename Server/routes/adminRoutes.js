const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const {
  registerAdmin,
  loginAdmin,
  removeEmployee,
  modifyEmployee,
  getAllEmployees,
  registerEmployee,
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
  addStudent,
  vacateAllRooms,
  addRoom,
  getRoomDetailsWithStudents,
  getAllComplaints,
  deleteComplaint,
  deleteAllComplaints,
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
router.put('/modify-student/:rollNo', upload.single('image') , authMiddleware, modifyStudent);
router.delete('/remove-student/:rollNo', authMiddleware, removeStudent);
router.delete('/students', authMiddleware, deleteAllStudents);

// Student details routes
router.get('/students', authMiddleware, getAllStudents);
router.get('/students/:rollNo/payments', authMiddleware, getStudentPayments);
router.post('/add-student', upload.single('image') , authMiddleware, addStudent);

// Application management routes
router.get('/applications', authMiddleware, getAllApplications);

// Employee Routes
router.post('/add-employee', upload.single('image') , authMiddleware, registerEmployee);
router.get('/employees', authMiddleware , getAllEmployees);
router.put('/modify-employee/:employeeId', upload.single('image') ,authMiddleware , modifyEmployee);
router.delete('/remove-employee/:employeeId', authMiddleware ,removeEmployee);

// Complaint
router.get('/complaints' , authMiddleware , getAllComplaints);
router.delete('/complaints/:id' , authMiddleware , deleteComplaint);
router.delete('/delete-complaints' , authMiddleware , deleteAllComplaints);

module.exports = router;
