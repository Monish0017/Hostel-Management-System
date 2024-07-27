const Application = require('../models/Application');
const Student = require('../models/Student');

exports.addApplication = async (req, res) => {
  const { rollNo } = req.user;
  const { preferredRoommatesRollNos = [], roomType, blockName } = req.body;

  try {
    console.log('Request received:', { rollNo, preferredRoommatesRollNos, roomType, blockName });

    // Check if the student already has an application
    const existingApplication = await Application.findOne({ studentRollNo: rollNo });
    if (existingApplication) {
      return res.status(400).json({ message: 'Application already exists' });
    }

    // Validate inputs before creating a new application
    if (!rollNo || !roomType || !blockName) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    // Validate preferred roommates if provided
    for (const roommateRollNo of preferredRoommatesRollNos) {
      const roommate = await Student.findOne({ rollNo: roommateRollNo });
      if (!roommate) {
        return res.status(400).json({ message: `Preferred roommate with roll number ${roommateRollNo} does not exist` });
      }

      // Check if the preferred roommate is already in an existing application
      const roommateInApplication = await Application.findOne({
        $or: [
          { studentRollNo: roommateRollNo },
          { preferredRoommatesRollNos: roommateRollNo }
        ]
      });
      if (roommateInApplication) {
        return res.status(400).json({ message: `Preferred roommate with roll number ${roommateRollNo} is already in an application` });
      }
    }

    // Create a new application
    let newApplication;
    try {
      newApplication = new Application({
        studentRollNo: rollNo,
        preferredRoommatesRollNos,
        roomType,
        blockName // corrected the field name
      });
    } catch (creationError) {
      console.error('Error creating new application instance:', creationError);
      return res.status(500).json({ message: 'Error creating new application instance' });
    }

    await newApplication.save();

    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error submitting application:', error.message || error);
    res.status(500).json({ error: 'Server error' });
  }
};
