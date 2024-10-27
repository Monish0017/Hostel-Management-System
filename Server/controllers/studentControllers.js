const Student = require('../models/Student');
const Room = require('../models/Room');
const Complaint = require('../models/Complaint');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
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

const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-password');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    console.log(1);
    // Find the associated room information using rollNo
    const room = await Room.findOne({ students: student.rollNo }).select('blockName roomNo');

    // Add room information to the student profile response
    const profileData = {
      ...student.toObject(),
      blockName: room ? room.blockName : null,
      roomNo: room ? room.roomNo : null,
    };

    res.json(profileData);
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};


// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Forgot Password API
const forgotPassword = async (req, res) => {
  const { rollNo } = req.body;

  try {
    const student = await Student.findOne({ rollNo });
    if (!student) {
      return res.status(404).json({ message: 'Student with this roll number does not exist.' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    student.resetPasswordToken = token;
    student.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await student.save();

    const resetUrl = `https://hostel-management-system-xi.vercel.app/reset-password/${token}`;
    const mailOptions = {
      from: `"Hostel Management System" <${process.env.EMAIL_USER}>`,
      to: student.email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link to reset your password:\n\n${resetUrl}`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Password reset email sent successfully.' });
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ message: 'Error in forgot password process.' });
  }
};

// Reset Password API
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const student = await Student.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!student) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    student.password = await bcrypt.hash(newPassword, 10);
    student.resetPasswordToken = undefined;
    student.resetPasswordExpires = undefined;
    await student.save();

    res.status(200).json({ message: 'Password has been successfully reset!' });
  } catch (error) {
    console.error('Error in reset password:', error);
    res.status(500).json({ message: 'Error resetting password.' });
  }
};

module.exports = {
  submitComplaint,
  getStudentComplaints,
  getStudentProfile,
  forgotPassword,
  resetPassword
};
