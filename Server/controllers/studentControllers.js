const Student = require('../models/Student');

const Complaint = require('../models/Complaint');


// Submit a new complaint
const submitComplaint = async (req, res) => {
  try {
    // Extract the student's roll number from the token (which should be decoded by middleware)
    const { rollNo } = req.user;
    const { complaintText } = req.body;

    // Fetch the student's details using the roll number
    const student = await Student.findOne({ rollNo });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const studentName = student.fullName; // Assuming fullName is a field in the Student model

    // Create a new complaint with the student details and complaint text
    const newComplaint = new Complaint({
      studentRollNo: rollNo,
      studentName,
      complaintText,
    });

    // Save the new complaint
    await newComplaint.save();

    return res.status(201).json({ message: 'Complaint submitted successfully', complaint: newComplaint });
  } catch (error) {
    console.error('Error submitting complaint:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};


// Fetch all complaints for a student
const getStudentComplaints = async (req, res) => {
  try {
    const studentRollNo = req.user.rollNo; // Assuming student authentication gives req.user
    const complaints = await Complaint.find({ studentRollNo });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaints', error });
  }
};

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

module.exports = {
  submitComplaint,
  getStudentComplaints,
  getStudentProfile,
};
