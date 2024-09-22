const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const RoomAllocator = require('../utils/allocation');
const Student = require('../models/Student');
const Room = require('../models/Room');
const Payment = require('../models/Payment');
const Application = require('../models/Application');
const multer = require('multer');
const excelToJson = require('convert-excel-to-json');
const path = require('path');

// Set storage engine for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload variable with storage config
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // limit file size to 1MB (optional)
}).single('file'); // expects the 'file' field in the form data


// Fetch all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({});
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const uploadStudents = (req, res) => {

  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: 'Error uploading file' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    try {
      const result = excelToJson({ sourceFile: filePath });
      const studentData = result.Sheet1;
      const newStudents = [];

      studentData.forEach(async (studentRow) => {
        const { rollNo, fullName, email, contactPhone, programme, classYear } = studentRow;

        if (!rollNo || !fullName || !email) {
          console.error(`Skipping row with missing data: ${JSON.stringify(studentRow)}`);
          return;
        }

        const existingStudent = await Student.findOne({ rollNo });
        if (!existingStudent) {
          newStudents.push({ rollNo, fullName, email, contactPhone, programme, classYear });
        }
      });

      if (newStudents.length > 0) {
        await Student.insertMany(newStudents);
        res.status(201).json({ msg: `${newStudents.length} students uploaded successfully` });
      } else {
        res.status(400).json({ msg: 'No new students to upload' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error processing the Excel file' });
    }
  });
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

const assignRoom = async (req, res) => {
  const { studentRollNo, applicationId } = req.body;
  
  try {
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const student = await Student.findOne({ rollNo: studentRollNo });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const room = await Room.findOne({
      blockName: application.blockName,
      capacity: application.roomType,
    });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.students.length >= room.capacity) {
      return res.status(400).json({ message: 'Room is full' });
    }

    // Assign the rollNo to the room's students array
    room.students.push(student.rollNo);
    await room.save();

    student.room = room._id; // Keep the room reference in Student for possible future use
    await student.save();

    const preferredRoommatesRollNos = application.preferredRoommatesRollNos || [];
    const preferredRoommates = await Student.find({ rollNo: { $in: preferredRoommatesRollNos } });

    for (const roommate of preferredRoommates) {
      if (!room.students.includes(roommate.rollNo)) {
        room.students.push(roommate.rollNo);
        await room.save();

        roommate.room = room._id;
        await roommate.save();
      }
    }

    await Application.deleteOne({ _id: applicationId });

    res.status(200).json({ message: 'Student and preferred roommates assigned to room successfully and application cleared' });
  } catch (error) {
    console.error('Error assigning room:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


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
    room.students = room.students.filter(id => id !== student.rollNo); // Change here
    await room.save();

    // Remove room assignment from student
    student.room = null; // Clear the room reference
    await student.save();

    res.status(200).json({ message: 'Student removed from room successfully' });
  } catch (error) {
    console.error('Error removing student from room:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a specific room using ObjectID
const deleteRoom = async (req, res) => {
  const { roomId } = req.params;
  
  try {
    const room = await Room.findByIdAndDelete(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Optionally: Unassign all students from the deleted room
    await Student.updateMany({ room: roomId }, { $unset: { room: "" } });

    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ message: 'Failed to delete room' });
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

// Delete all students
const deleteAllStudents = async (req, res) => {
  try {
    await Student.deleteMany({});
    res.status(200).json({ message: 'All students have been deleted successfully' });
  } catch (error) {
    console.error('Error deleting students:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Failed to fetch rooms' });
  }
};

// Vacate all rooms (remove all students from assigned rooms)
const vacateAllRooms = async (req, res) => {
  try {
    // Find all rooms and remove students
    await Room.updateMany({}, { $set: { students: [] } });

    // Also update all students to remove room reference
    await Student.updateMany({}, { $unset: { room: "" } });

    res.status(200).json({ message: 'All rooms have been vacated successfully' });
  } catch (error) {
    console.error('Error vacating rooms:', error);
    res.status(500).json({ message: 'Failed to vacate rooms' });
  }
};

// Add a new room
const addRoom = async (req, res) => {
  const { hostelName, blockName, roomType, floor, roomNo, capacity } = req.body;

  // Validate input
  if (!hostelName || !blockName || !roomType || !floor || !roomNo || !capacity) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    // Check if the room already exists in the specified block
    const existingRoom = await Room.findOne({ roomNo, blockName });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room already exists in this block.' });
    }

    // Create a new room instance
    const newRoom = new Room({
      hostelName,
      blockName,
      roomType,
      floor,
      roomNo,
      capacity,
      students: [] // Initialize with an empty students array
    });

    // Save the new room to the database
    await newRoom.save();
    res.status(201).json({ message: 'Room added successfully', room: newRoom });
  } catch (error) {
    console.error('Error adding room:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get room details including roll numbers of students assigned
const getRoomDetailsWithStudents = async (req, res) => {
  const { studentRollNo } = req.params;

  try {
    const student = await Student.findOne({ rollNo: studentRollNo }).populate('room'); // Populate room details
    if (!student || !student.room) {
      return res.status(404).json({ message: 'Student or room not found' });
    }

    const room = student.room;
    const studentRollNosInRoom = await Student.find({ room: room._id }).select('rollNo'); // Get roll numbers of students in the room

    res.status(200).json({
      roomNo: room.roomNo,
      blockName: room.blockName,
      students: studentRollNosInRoom.map(s => s.rollNo),
    });
  } catch (error) {
    console.error('Error fetching room details with students:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAllStudents,
  uploadStudents,
  getStudentPayments,
  removeStudentFromRoom,
  assignRoom,
  removeStudent,
  modifyStudent,
  getAllApplications,
  deleteAllStudents,
  getAllRooms,
  deleteRoom,
  vacateAllRooms,
  addRoom,
  getRoomDetailsWithStudents,
  allocateRooms
};
