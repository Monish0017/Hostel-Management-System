const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

// Import routes
const studentRoutes = require('./routes/studentRoutes');
const foodRoutes = require('./routes/foodRoutes');
const roomRoutes = require('./routes/roomRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const authRoutes = require('./routes/authRoutes'); // Add this line

// Use routes
app.use('/students', studentRoutes);
app.use('/food', foodRoutes);
app.use('/rooms', roomRoutes);
app.use('/faculty', facultyRoutes);
app.use('/auth', authRoutes); // Add this line

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
