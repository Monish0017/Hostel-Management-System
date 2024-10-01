const Student = require('../models/Student');
const StudentApplication = require('../models/StudentApplication');
const Payment = require('../models/Payment');
const bcrypt = require('bcrypt');
const { ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage'); 
const { storage } = require('../firebaseConfig'); 


// Submit a new student application
const submitApplication = async (req, res) => {
  const { fullName, email, rollNo, contactPhone, programme, classYear, fatherName, residentialAddress, primaryMobileNumber, secondaryMobileNumber } = req.body;

  // Validate input
  if (!fullName || !rollNo || !email || !contactPhone || !programme || !classYear || !fatherName || !residentialAddress || !primaryMobileNumber) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  console.log(1);
  try {
    // Check if the application with the same roll number already exists
    const existingApplication = await StudentApplication.findOne({ rollNo });
    if (existingApplication) {
      return res.status(400).json({ message: 'Application with this roll number already exists.' });
    }

    // Handle image upload if provided
    let imageUrl = '';
    if (req.file) {
      const file = req.file;
      const fileName = `${rollNo}-${Date.now()}-${file.originalname}`; // Create a unique filename
      const fileRef = ref(storage, `applications/${fileName}`);

      // Upload the file to Firebase Storage
      const snapshot = await uploadBytes(fileRef, file.buffer);
      imageUrl = await getDownloadURL(snapshot.ref); // Get the image URL
    }

    // Create a new application document with the image URL
    const newApplication = new StudentApplication({
      fullName,
      rollNo,
      email,
      contactPhone,
      programme,
      classYear,
      fatherName,
      residentialAddress,
      primaryMobileNumber,
      secondaryMobileNumber,
      image: imageUrl, // Save the image URL in the application data
    });

    // Save the new application to the database
    await newApplication.save();
    res.status(201).json({ message: 'Application submitted successfully!', application: newApplication });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ message: 'Server error' });
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
      const paymentRecord = await Payment.findOne({ studentRollNo: application.rollNo, status: 'paid' });
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
          password: hashedPassword, // Use the hashed password
          image: application.image // Swap the image link from application to student model
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

      // Find the payment record for the student using rollNo
      const paymentRecord = await Payment.findOne({ studentRollNo: application.rollNo, status: 'paid' });

      if (!paymentRecord) {
        // If payment is not completed, delete the image from Firebase Storage
        if (application.image) {
          const imageRef = ref(storage, application.image); // Reference the image in Firebase Storage

          // Delete the image from Firebase Storage
          await deleteObject(imageRef);
          console.log(`Deleted image for rollNo ${application.rollNo} from Firebase Storage.`);
        }

        // Delete the application from MongoDB
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
