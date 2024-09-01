const Payment = require('../models/Payment');
const Student = require('../models/Student');

exports.submitPayment = async (req, res) => {
  try {
    const { rollNo, amount, status } = req.body; 

    // Validate RollNo and get student
    const student = await Student.findOne({ rollNo });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if the student has already paid the fees
    const existingPayment = await Payment.findOne({
      student: student._id,
      status: 'paid'
    });

    if (existingPayment) {
      return res.status(400).json({ message: 'Fees already paid by the student' });
    }

    // Create a new payment
    const payment = new Payment({
      student: student._id, // Reference to student
      amount,
      status: status || 'pending',
    });

    const savedPayment = await payment.save();

    // Update student with new payment
    student.payments = savedPayment._id;
    await student.save();

    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
