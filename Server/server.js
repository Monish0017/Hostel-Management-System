const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Ensure this is true or false based on your need
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Importing routes
const studentRoutes = require('./routes/studentRoutes');
const foodRoutes = require('./routes/foodRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const studentApplicationRoutes = require('./routes/stduentApplicationRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
// const ivrsRoutes = require('./routes/ivrsRoutes');

// Use routes
app.use('/student', studentRoutes);
app.use('/food', foodRoutes);
app.use('/faculty', facultyRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api', applicationRoutes);
app.use('/payments', paymentRoutes);
app.use('/application',studentApplicationRoutes);
app.use('/employee', employeeRoutes);
// app.use('/api/ivrs', ivrsRoutes);

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});