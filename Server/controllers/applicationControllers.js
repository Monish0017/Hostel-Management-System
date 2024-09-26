const Student = require('../models/Student');
const Room = require('../models/Room');

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

    // Check if the student's fees have been paid by checking the `amount` field
    const currentAmount = parseFloat(student.amount);  // Convert the amount to a number
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
      students: { $lt: ["$capacity"] }  // Ensure the room has fewer students than its capacity
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
    student.amount = newAmount.toString();  // Convert the new amount back to a string

    await student.save();

    // Check and assign preferred roommates (if paid)
    const preferredRoommates = await Student.find({ rollNo: { $in: preferredRoommatesRollNos } });

    for (const roommate of preferredRoommates) {
      const roommateAmount = parseFloat(roommate.amount);

      // Only assign the roommate if they have enough money (at least 50,000)
      if (!isNaN(roommateAmount) && roommateAmount >= 50000) {
        if (!room.students.includes(roommate.rollNo)) {
          room.students.push(roommate.rollNo);
          await room.save();

          roommate.room = room._id;

          // Reduce 50,000 from the roommate's amount
          const newRoommateAmount = roommateAmount - 50000;
          roommate.amount = newRoommateAmount.toString();  // Convert back to a string

          await roommate.save();
        }
      } else {
        console.log(`Preferred roommate ${roommate.rollNo} has insufficient funds or hasn't completed payment.`);
      }
    }

    res.status(200).json({ message: 'Room assigned successfully, and amounts reduced for the student and any paid preferred roommates' });
  } catch (error) {
    console.error('Error assigning room:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
