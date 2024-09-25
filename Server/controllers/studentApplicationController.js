const Student = require('../models/Student');
const StudentApplication = require('../models/StudentApplication');
const Payment = require('../models/Payment');
const bcrypt = require('bcrypt');

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
        console.log(`Processing application for rollNo: ${application.rollNo}`);
  
        // Find the payment record for the student using rollNo
        const paymentRecord = await Payment.findOne({ studentrollNo: application.rollNo, status: 'paid' });
        console.log(paymentRecord);
        
        if (paymentRecord) {
          console.log(`Payment record found for rollNo: ${application.rollNo}`);
  
          // Set the default password to the lowercase of the rollNo
          const defaultPassword = application.rollNo.toLowerCase();
          console.log(`Default password for ${application.rollNo}: ${defaultPassword}`);
  
          // Hash the password using bcrypt
          const hashedPassword = await bcrypt.hash(defaultPassword, 10);
          console.log(`Hashed password for ${application.rollNo}: ${hashedPassword}`);
  
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
            amount: paymentRecord.amount, // Assign the amount paid from the payment record
            password: hashedPassword // Use the hashed password
          };
  
          // Save new student record to the Student model
          const newStudent = new Student(studentData);
          await newStudent.save();
  
          // Delete the processed application after student creation
          await StudentApplication.findByIdAndDelete(application._id);
  
          // Delete the payment record after processing
          await Payment.findByIdAndDelete(paymentRecord._id);
  
          console.log(`Student with rollNo ${application.rollNo} has been added successfully!`);
        } else {
          console.log(`No completed payment found for student: ${application.rollNo}`);
        }
      }
  
      res.status(200).json({ message: 'All eligible students have been processed!' });
    } catch (error) {
      console.error('Error processing applications:', error);
      res.status(500).json({ message: 'Error processing applications', error: error.message });
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
        console.log(`Processing application for rollNo: ${application.rollNo}`);
  
        // Find the payment record for the student using rollNo and paymentStatus false
        const paymentRecord = await Payment.findOne({ studentRollNo: application.rollNo, status: 'paid' });
        
        if (!paymentRecord) {
          // If payment is not completed, delete the application
          await StudentApplication.findByIdAndDelete(application._id);
          deletedCount += 1;
          console.log(`Deleted application for rollNo ${application.rollNo} due to unpaid status.`);
        } else {
          console.log(`No unpaid payment found for rollNo ${application.rollNo}.`);
        }
      }
  
      res.status(200).json({ message: `${deletedCount} unpaid applications have been deleted.` });
    } catch (error) {
      console.error('Error deleting unpaid applications:', error);
      res.status(500).json({ message: 'Error deleting unpaid applications', error });
    }
  };
  
  // Fetch all student applications for the admin
const getAllApplications = async (req, res) => {
    try {
      // Retrieve all student applications from the database
      const applications = await StudentApplication.find({});
  
      // Check if applications exist
      if (applications.length === 0) {
        return res.status(404).json({ message: 'No student applications found' });
      }
  
      // Send the applications to the client (admin)
      res.status(200).json({ applications });
    } catch (error) {
      // Handle any errors that occur during the fetch
      res.status(500).json({ message: 'Error fetching student applications', error });
    }
  };

module.exports = {
  submitApplication,
  processApplication,
  deleteUnpaidApplications,
  getAllApplications
};
