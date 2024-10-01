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

// Use CORS middleware
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

app.use('/Assets', express.static(path.join(__dirname, 'Assets')));
// Import routes
const studentRoutes = require('./routes/studentRoutes');//Over
const foodRoutes = require('./routes/foodRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Use routes
app.use('/students', studentRoutes);
app.use('/food', foodRoutes);
app.use('/faculty', facultyRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api', applicationRoutes);
app.use('/payments' , paymentRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
