const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB
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

// Use routes
app.use('/students', studentRoutes);
app.use('/food', foodRoutes);
app.use('/faculty', facultyRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api', applicationRoutes);
app.use('/payments', paymentRoutes);
app.use('/application', studentApplicationRoutes);

// Health check route
app.get('/', (req, res) => {
    res.send('Hostel Management System API is running');
});

// Start the server
const PORT = process.env.PORT || 3000; // Use dynamic port for deployment
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
