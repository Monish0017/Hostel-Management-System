const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Atlas connected...'))
    .catch(err => console.log(err));

// Import routes
const studentRoutes = require('./routes/studentRoutes');
const foodRoutes = require('./routes/foodRoutes');
const roomRoutes = require('./routes/roomRoutes');
const facultyRoutes = require('./routes/facultyRoutes');

// Use routes
app.use('/students', studentRoutes);
app.use('/food', foodRoutes);
app.use('/rooms', roomRoutes);
app.use('/faculty', facultyRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
