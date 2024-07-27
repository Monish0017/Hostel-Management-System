const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Use CORS middleware
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Import routes
const studentRoutes = require('./routes/studentRoutes');//Over
const foodRoutes = require('./routes/foodRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Add this line
const applicationRoutes = require('./routes/applicationRoutes');

// Use routes
app.use('/students', studentRoutes);
app.use('/food', foodRoutes);
app.use('/faculty', facultyRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes); // Add this line
app.use('/api', applicationRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
