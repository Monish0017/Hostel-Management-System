const nodemailer = require('nodemailer');
const Student = require('../models/Student');
const Room = require('../models/Room');

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use your preferred email service
  auth: {
    user: process.env.EMAIL_USER, // Replace with your email
    pass: process.env.EMAIL_PASS // Replace with your email password or app password
  }
});

exports.assignRoomIfPaid = async (req, res) => {
  const { rollNo } = req.user;
  const { preferredRoommatesRollNos = [], roomType, blockName } = req.body;

  try {
    console.log('Request received:', { rollNo, preferredRoommatesRollNos, roomType, blockName });

    // Find the student by roll number
    const student = await Student.findOne({ rollNo });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if the student's fees have been paid
    const currentAmount = parseFloat(student.amount);
    if (isNaN(currentAmount) || currentAmount < 50000) {
      return res.status(400).json({ message: 'Insufficient funds. Room cannot be assigned.' });
    }

    // Validate inputs
    if (!roomType || !blockName) {
      return res.status(400).json({ message: 'Invalid roomType or blockName' });
    }

    // Find an available room
    let room = await Room.findOne({
      blockName,
      capacity: roomType,
      students: { $lt: ["$capacity"] } // Ensure room has fewer students than capacity
    });

    if (!room || room.students.length >= room.capacity) {
      return res.status(404).json({ message: 'No available rooms found' });
    }

    // Assign the room to the student
    room.students.push(student.rollNo);
    await room.save();

    student.room = room._id;

    // Reduce 50,000 from the student's amount
    const newAmount = currentAmount - 50000;
    student.amount = newAmount.toString();

    await student.save();

    // Send success email
    await transporter.sendMail({
      from:`Hostel Management System <${process.env.EMAIL_USER}>`, // Sender address
      to: student.email, // Recipient email from student model
      subject: 'Room Assignment Successful',
      text: `Dear ${student.name},\n\nYour room has been successfully assigned in ${blockName}. Your remaining balance is now ${newAmount}.\n\nBest Regards,\nHostel Management`
    });

    // Check and assign preferred roommates (if paid)
    const preferredRoommates = await Student.find({ rollNo: { $in: preferredRoommatesRollNos } });

    for (const roommate of preferredRoommates) {
      const roommateAmount = parseFloat(roommate.amount);

      if (!isNaN(roommateAmount) && roommateAmount >= 50000) {
        if (!room.students.includes(roommate.rollNo)) {
          room.students.push(roommate.rollNo);
          await room.save();

          roommate.room = room._id;

          const newRoommateAmount = roommateAmount - 50000;
          roommate.amount = newRoommateAmount.toString();

          await roommate.save();

          // Send success email to roommate
          await transporter.sendMail({
            from: 'your-email@gmail.com', // Sender address
            to: roommate.email, // Recipient email from roommate model
            subject: 'Room Assignment Successful',
            text: `Dear ${roommate.name},\n\nYou have been successfully assigned to share a room with ${student.name} in ${blockName}. Your remaining balance is now ${newRoommateAmount}.\n\nBest Regards,\nHostel Management`
          });
        }
      } else {
        console.log(`Preferred roommate ${roommate.rollNo} has insufficient funds or hasn't completed payment.`);
      }
    }

    res.status(200).json({ message: 'Room assigned successfully, and amounts reduced for the student and any paid preferred roommates' });
  } catch (error) {
    console.error('Error assigning room:', error);
    
    // Send failure email
    await transporter.sendMail({
      from: 'your-email@gmail.com', // Sender address
      to: student.email, // Recipient email from student model
      subject: 'Room Assignment Failed',
      text: `Dear ${student.name},\n\nThere was an error assigning your room. Please contact the administration for assistance.\n\nBest Regards,\nHostel Management`
    });

    res.status(500).json({ error: 'Server error' });
  }
};
