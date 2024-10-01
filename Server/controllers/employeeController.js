// controllers/employeeAuthController.js
const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');
const Student = require('../models/Student');
const FoodToken = require("../models/FoodToken");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Employee Login Controller
exports.loginEmployee = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if employee exists
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate the password
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token for the employee directly
    const token = jwt.sign(
      {
        employeeId: employee._id, // Include the employee ID in the token
        email: employee.email, // Include the employee email in the token
      },
      process.env.JWT_SECRET, // Your secret key
      { expiresIn: '1h' } // Set expiration time
    );

    // Respond with the token and employee details
    res.json({
      token,
      employee: {
        id: employee._id,
        email: employee.email,
        name: employee.name, // Assuming there is a 'name' field
        // Add any other fields you want to include in the response
      },
    });
  } catch (error) {
    console.error('Server Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Clear food tokens based on token ID
exports.clearTokens = async (req, res) => { 
    try {
      const { qrData } = req.body;
  
      // Check if tokenId is provided
      if (!qrData) {
        return res.status(400).json({ message: 'Token ID is required' });
      }
  
      // Validate tokenId format
      if (!mongoose.Types.ObjectId.isValid(qrData)) {
        return res.status(400).json({ message: 'Invalid Token ID format' });
      }
  
      // Find the token in the database
      const token = await FoodToken.findById(qrData);

      // Check if token exists
      if (!token) {
        return res.status(404).json({ message: 'Token not found' });
      }
  
      // Check the current quantity of tokens
      if (token.quantity > 1) {
        // Decrement the quantity if more than 1
        token.quantity -= 1;
        await token.save(); // Save the updated token
        return res.status(200).json({
          message: 'Token quantity decremented successfully',
          quantity: token.quantity,
        });
      } else {
        // If quantity is 1, delete the token
        await FoodToken.deleteOne({ _id: qrData });
        return res.status(200).json({ message: 'Token cleared successfully' });
      }
    } catch (err) {
      console.error('Error clearing tokens:', err);
      res.status(500).json({ message: 'Error clearing tokens', error: err.message || 'Unknown error' });
    }
  };
  
// Scan QR Code and Issue Food
exports.scanQrAndIssueFood = async (req, res) => {
    try {
      const { qrData } = req.body; // Assuming the QR code data contains tokenId
      const tokenId = qrData; // Extract tokenId from QR data
  
      // Validate tokenId format
      if (!mongoose.Types.ObjectId.isValid(tokenId)) {
        return res.status(400).json({ message: 'Invalid Token ID format' });
      }
  
      // Find the token in the database
      const token = await FoodToken.findById(tokenId);
      if (!token) {
        return res.status(404).json({ message: 'Token not found' });
      }
  
      // Fetch student profile using the student reference
      const student = await Student.findOne({ _id: token.student }); // Changed to Employee
      if (!student) {
        return res.status(404).json({ message: 'Student profile not found' });
      }
  
      // Respond with student profile and food item without modifying quantity
      return res.status(200).json({
        message: 'Token scanned successfully',
        student: {
          rollNo: student.rollNo,
          name: student.fullName,
          image: student.image, // Assuming profilePhoto field exists
        },
        foodItem: {
          name: token.foodItemName,
          quantity: token.quantity, // Current quantity without decrement
        },
      });
    } catch (err) {
      console.error('Error scanning QR code and issuing food:', err);
      res.status(500).json({ message: 'Error scanning QR code and issuing food', error: err.message || 'Unknown error' });
    }
  };
  