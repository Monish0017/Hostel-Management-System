const Student = require('../models/Student');
const StudentApplication = require('../models/studentApplicationSchema');
const Payment = require('../models/Payment');

// Submit a new student application
const submitApplication = async (req, res) => {
  try {
    const applicationData = req.body;
    const newApplication = new StudentApplication(applicationData);
    await newApplication.save();
    res.status(201).json({ message: 'Application submitted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting application', error });
  }
};

const processApplication = async (req, res) => {
    try {
      // Fetch all student applications
      const applications = await StudentApplication.find({});
  
      if (applications.length === 0) {
        return res.status(404).json({ message: 'No applications found' });
      }
  
      // Iterate through each application
      for (const application of applications) {
        // Find the payment record for the student using rollNo
        const paymentRecord = await Payment.findOne({ studentRollNo: application.rollNo, paymentStatus: 'Completed' });
  
        if (paymentRecord) {
          // Move the details from application to Student model if payment is completed
          const studentData = {
            fullName: application.fullName,
            email: application.email,
            rollNo: application.rollNo,
            contactPhone: application.contactPhone,
            programme: application.programme,
            classYear: application.classYear,
            fatherName: application.fatherName,
            residentialAddress: application.residentialAddress,
            primaryMobileNumber: application.primaryMobileNumber,
            secondaryMobileNumber: application.secondaryMobileNumber,
            payment: paymentRecord._id, // Assign the payment._id reference
            amount: paymentRecord.amount // Assign the amount paid from the payment record
          };
  
          // Save new student record to the Student model
          const newStudent = new Student(studentData);
          await newStudent.save();
  
          // Delete the processed application after student creation
          await StudentApplication.findByIdAndDelete(application._id);
  
          console.log(`Student with rollNo ${application.rollNo} has been added successfully!`);
        } else {
          console.log(`No completed payment found for student: ${application.rollNo}`);
        }
      }
  
      res.status(200).json({ message: 'All eligible students have been processed!' });
    } catch (error) {
      res.status(500).json({ message: 'Error processing applications', error });
    }
  };
  

  const deleteUnpaidApplications = async (req, res) => {
    try {
      // Fetch all student applications
      const applications = await StudentApplication.find({});
  
      if (applications.length === 0) {
        return res.status(404).json({ message: 'No applications found' });
      }
  
      let deletedCount = 0;
  
      // Iterate through each application
      for (const application of applications) {
        // Find the payment record for the student using rollNo
        const paymentRecord = await Payment.findOne({ studentRollNo: application.rollNo, paymentStatus: 'Completed' });
  
        // If payment does not exist or is not completed, delete the application
        if (!paymentRecord) {
          await StudentApplication.findByIdAndDelete(application._id);
          deletedCount += 1;
  
          console.log(`Application for rollNo ${application.rollNo} has been deleted due to unpaid status.`);
        }
      }
  
      res.status(200).json({ message: `${deletedCount} unpaid applications have been deleted.` });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting unpaid applications', error });
    }
  };
  
module.exports = {
  submitApplication,
  processApplication,
  deleteUnpaidApplications
};
