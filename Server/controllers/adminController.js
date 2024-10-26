const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const RoomAllocator = require('../utils/allocation');
const Student = require('../models/Student');
const Room = require('../models/Room');
const Payment = require('../models/Payment');
const Employee = require('../models/Employee');
const Application = require('../models/Application');
const { ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage'); 
const { storage } = require('../firebaseConfig'); 
const Complaint = require("../models/Complaint");

const addStudent = async (req, res) => {
  const { fullName, rollNo, email, contactPhone, amount , programme, classYear, fatherName, residentialAddress, primaryMobileNumber, secondaryMobileNumber } = req.body;

  // Validate input
  if (!fullName || !rollNo || !email || !contactPhone || !programme || !classYear || !fatherName || !residentialAddress || !primaryMobileNumber) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    // Check if the student already exists
    const existingStudent = await Student.findOne({ rollNo });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this roll number already exists.' });
    }

    const password = rollNo.toLowerCase();
    console.log(password);
    // Handle image upload if provided
    let imageUrl = '';
    if (req.file) {
      const file = req.file;
      const fileName = `${rollNo}-${Date.now()}-${file.originalname}`; // Create a unique filename
      const fileRef = ref(storage, `students/${fileName}`);

      // Upload the file to Firebase Storage
      const snapshot = await uploadBytes(fileRef, file.buffer);
      imageUrl = await getDownloadURL(snapshot.ref); // Get the image URL
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new student
    const newStudent = new Student({
      fullName,
      rollNo,
      email,
      password: hashedPassword,
      contactPhone,
      amount,
      programme,
      classYear,
      fatherName,
      residentialAddress,
      primaryMobileNumber,
      secondaryMobileNumber,
      image: imageUrl, // Save the image URL in the student record
    });

    // Save the new student to the database
    await newStudent.save();
    res.status(201).json({ message: 'Student added successfully', student: newStudent });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({});
    res.json(students);
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

const manualAssignStudentToRoom = async (req, res) => {
  const { rollNo, blockName, roomNo } = req.body;

  try {
    // Find the student by roll number
    const student = await Student.findOne({ rollNo: rollNo });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Find the room by blockName and roomNo
    const room = await Room.findOne({ blockName, roomNo });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if the room has available space
    if (room.students.length >= room.capacity) {
      return res.status(400).json({ message: 'Room is already full' });
    }

    // Check if the student has enough amount to pay the fees
    const currentAmount = parseFloat(student.amount) || 0; // Convert to number
    const roomFee = 50000;

    if (currentAmount < roomFee) {
      return res.status(400).json({ message: 'Insufficient amount to cover room fees' });
    }

    // Deduct the room fee from the student's amount
    student.amount = (currentAmount - roomFee).toString(); // Convert back to string

    // Assign the student to the room
    room.students.push(student.rollNo);
    await room.save();

    // Update the student's room reference
    student.room = room._id;
    await student.save();

    res.status(200).json({ message: `Student ${rollNo} assigned to room ${roomNo} in block ${blockName} successfully.` });
  } catch (error) {
    console.error('Error assigning student to room:', error);
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


    // Add 50,000 back to the student's amount
    const currentAmount = parseFloat(student.amount);
    const updatedAmount = currentAmount + 50000;
    student.amount = updatedAmount.toString(); // Convert back to string

    // Remove room assignment from student
    student.room = null;
    await student.save();

    res.status(200).json({ message: 'Student removed from room successfully and 50,000 added to amount.' });
  } catch (error) {
    console.error('Error removing student from room:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


const deleteRoom = async (req, res) => {
  const { roomId } = req.params;

  try {
    // Find the room to be deleted
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Find all students currently assigned to the room
    const studentsInRoom = await Student.find({ room: roomId });

    // Update each student's amount by adding 50,000 and unassign room
    for (const student of studentsInRoom) {
      let currentAmount = parseInt(student.amount) || 0; // Convert string to integer
      student.amount = (currentAmount + 50000).toString(); // Add 50,000 and convert back to string
      student.room = null; // Unassign room from student
      await student.save();
    }

    // Remove student references from the room
    room.students = []; // Assuming students is an array in Room schema
    await room.save();

    // Delete the room after processing the students
    await Room.findByIdAndDelete(roomId); // Use findByIdAndDelete

    res.status(200).json({ message: 'Room deleted successfully, and students updated.' });
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
    const student = await Student.findOne({ rollNo });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if there's an image file uploaded
    if (req.file) {
      // Delete the existing image from Firebase if it exists
      if (student.image) { // Assume student.image contains the path to the image in Firebase Storage
        const imageRef = ref(storage, student.image); // Create a reference to the file to delete

        await deleteObject(imageRef)
          .then(() => {
            console.log('Previous image deleted successfully from Firebase Storage');
          })
          .catch((error) => {
            console.error('Error deleting previous image from Firebase Storage:', error);
            return res.status(500).json({ error: 'Failed to delete previous image' });
          });
      }

      // Generate a new filename using Date.now()
      const newImageName = `students/${Date.now()}-${req.file.originalname}`; // Include the timestamp

      // Upload the new image to Firebase Storage
      const newImageRef = ref(storage, newImageName); // Specify the path to store the image

      await uploadBytes(newImageRef, req.file.buffer).then(async () => {
        // Get the download URL for the new image
        const newImageUrl = await getDownloadURL(newImageRef);

        // Update the student record with the new image URL
        updates.image = newImageUrl;
      }).catch((error) => {
        console.error('Error uploading new image to Firebase:', error);
        return res.status(500).json({ error: 'Failed to upload new image' });
      });
    }

    // Update the student with the provided updates
    const updatedStudent = await Student.findOneAndUpdate({ rollNo }, updates, { new: true });

    res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
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

    // Delete student profile image from Firebase Storage
    if (student.image) { // Assume profileImageUrl contains the path to the image in Firebase Storage
      const imageRef = ref(storage, student.image); // Create a reference to the file to delete

      deleteObject(imageRef)
        .then(() => {
          console.log('Image deleted successfully from Firebase Storage');
        })
        .catch((error) => {
          console.error('Error deleting image from Firebase Storage:', error);
        });
    }

    res.status(200).json({ message: 'Student removed successfully' });
  } catch (error) {
    console.error('Error removing student:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const reduceMoneyFromAccounts = async (req, res) => {
  const { amount } = req.body; // The amount to reduce from each student's account

  try {
    // Check if the amount is valid
    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than zero.' });
    }

    // Find all students and reduce the specified amount
    const students = await Student.find({});

    const updatePromises = students.map(async (student) => {
      const currentAmount = parseFloat(student.amount);
      const newAmount = currentAmount - amount;

      // Update student's amount if the new amount is not negative
      if (newAmount >= 0) {
        student.amount = newAmount.toString();
        await student.save();
      }
    });

    await Promise.all(updatePromises);

    res.status(200).json({ message: 'Money successfully reduced from all student accounts.' });
  } catch (error) {
    console.error('Error reducing money from accounts:', error);
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

const registerEmployee = async (req, res) => {
  console.log(req.body); // This will log the non-file fields

  try {
      // Accessing fields directly from req.body
      const { fullName, contactPhone, email, position, salary, address } = req.body;

      // Check for necessary fields
      if (!fullName || !contactPhone || !email || !position || !salary || !address) {
          return res.status(400).json({ error: 'All fields are required' });
      }
      
      console.log(req.body);
      console.log(req.file);

      // Check for file upload
      if (!req.file) {
          return res.status(400).json({ error: 'Profile image is required' });
      }

      // Hash the password using bcrypt
      const password = fullName.substring(0, 6).toLowerCase(); // Generate a default password based on full name
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

      // Create a reference to Firebase Storage for the employee image
      const storageRef = ref(storage, `employees/${Date.now()}_${req.file.originalname}`); // Use timestamp for unique filenames

      // Upload the file to Firebase Storage using buffer from Multer
      const snapshot = await uploadBytes(storageRef, req.file.buffer);

      // Get the download URL after uploading
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Create a new Employee document
      const newEmployee = new Employee({
          fullName,
          contactPhone,
          email,
          position,
          salary,
          password: hashedPassword, // Store the hashed password
          address,
          image: downloadURL, // Store the Firebase download URL for the image
      });

      // Save the new employee to MongoDB
      await newEmployee.save();
      
      // Respond with the new employee details (excluding the password)
      res.status(201).json({
          _id: newEmployee._id, // Return the MongoDB ID
          fullName: newEmployee.fullName,
          contactPhone: newEmployee.contactPhone,
          email: newEmployee.email,
          position: newEmployee.position,
          salary: newEmployee.salary,
          address: newEmployee.address,
          image: newEmployee.image, // Include the image URL in the response
      });
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
  }
};

// Get all employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Modify an existing employee
const modifyEmployee = async (req, res) => {
  const { employeeId } = req.params; // Extracting employeeId from request parameters
  const updates = req.body; // Destructuring properties from req.body

  try {
    const employee = await Employee.findById(employeeId); // Find the employee by ID
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' }); // Handle case where employee is not found
    }

    // Check if there's an image file uploaded
    if (req.file) {
      // Delete the existing image from Firebase if it exists
      if (employee.image) {
        const imageRef = ref(storage, employee.image); // Create a reference to the file to delete

        await deleteObject(imageRef)
          .then(() => {
            console.log('Previous image deleted successfully from Firebase Storage');
          })
          .catch((error) => {
            console.error('Error deleting previous image from Firebase Storage:', error);
            return res.status(500).json({ error: 'Failed to delete previous image' });
          });
      }

      // Upload the new image to Firebase Storage
      const newImageRef = ref(storage, `employees/${req.file.filename}`); // Specify the path to store the image

      await uploadBytes(newImageRef, req.file.buffer).then(async () => {
        // Get the download URL for the new image
        const newImageUrl = await getDownloadURL(newImageRef);

        // Update the employee record with the new image URL
        updates.image = newImageUrl; // Update the image field with the new URL
      }).catch((error) => {
        console.error('Error uploading new image to Firebase:', error);
        return res.status(500).json({ error: 'Failed to upload new image' });
      });
    }

    // Update the employee with the provided updates
    const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, updates, { new: true, runValidators: true });

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' }); // Handle case where employee is not found
    }

    res.status(200).json({ message: 'Employee updated successfully', employee: updatedEmployee }); // Respond with success message and updated employee data
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Server error' }); // Send error response
  }
};


// Remove an employee
const removeEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Find the employee to get their image URL
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Delete employee record
    await Employee.findByIdAndDelete(employeeId); // Use findByIdAndDelete instead of findByIdAndRemove

    // Delete employee image from Firebase Storage if it exists
    if (employee.image) {
      const imageRef = ref(storage, employee.image); // Create a reference to the file to delete

      await deleteObject(imageRef)
        .then(() => {
          console.log('Image deleted successfully from Firebase Storage');
        })
        .catch((error) => {
          console.error('Error deleting image from Firebase Storage:', error);
        });
    }

    res.status(204).send(); // Successfully deleted
  } catch (error) {
    console.error('Error removing employee:', error);
    res.status(500).json({ error: error.message });
  }
};

// Fetch all complaints for admin view
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({});
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaints', error });
  }
};

// Delete a complaint
const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const complaint = await Complaint.findByIdAndDelete(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting complaint', error });
  }
};

// Delete all complaints controller
const deleteAllComplaints = async (req, res) => {
  try {
    await Complaint.deleteMany({}); // Delete all complaints from the database
    return res.status(200).json({ message: 'All complaints deleted successfully' });
  } catch (error) {
    console.error('Error deleting complaints:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  deleteAllComplaints,
  registerAdmin,
  loginAdmin,
  getAllStudents,
  getStudentPayments,
  removeStudentFromRoom,
  manualAssignStudentToRoom,
  removeStudent,
  modifyStudent,
  getAllApplications,
  deleteAllStudents,
  getAllRooms,
  deleteRoom,
  vacateAllRooms,
  registerEmployee,
  removeEmployee,
  modifyEmployee,
  reduceMoneyFromAccounts,
  getAllEmployees,
  addRoom,
  getRoomDetailsWithStudents,
  addStudent,
  getAllComplaints,
  deleteComplaint,
  allocateRooms
};
