const Payment = require('../models/Payment');
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');

exports.submitPayment = async (req, res) => {
  try {
    
    const { rollNo , amount, status } = req.body;

    const student = await Student.findOne({ rollNo });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if the student has already paid the fees
    const existingPayment = await Payment.findOne({
      studentrollNo: rollNo, // Use rollNo instead of student._id
      status: 'paid'
    });

    if (existingPayment) {
      return res.status(400).json({ message: 'Fees already paid by the student' });
    }

    // Create a new payment
    const payment = new Payment({
      studentrollNo: rollNo, // Store rollNo directly
      amount,
      status: status || 'pending',
    });

    const savedPayment = await payment.save();

    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
