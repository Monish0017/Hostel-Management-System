const FoodItem = require('../models/FoodItem');
const FoodToken = require('../models/FoodToken');
const Student = require('../models/Student');
const upload = require('../middleware/upload'); // Assuming the multer setup is in a file named upload.js

exports.addFoodItem = async (req, res) => {
    console.log('File info:', req.file);
    console.log('Request body:', req.body);

    try {
      const { name, availableDays } = req.body;
      const imagePath = req.file ? `/Assets/${req.file.originalname}` : null;
      console.log('File info:', req.file);
      console.log('Request body:', req.body);


      if (!imagePath) {
        return res.status(400).json({ error: 'Image is required' });
      }

      const newFoodItem = new FoodItem({ name, image: imagePath, availableDays });
      await newFoodItem.save();
      res.status(201).json(newFoodItem);
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  };

// Delete a food item (Admin)
exports.deleteFoodItem = async (req, res) => {
  try {
    const { id } = req.params;
    await FoodItem.findByIdAndDelete(id);
    res.status(200).json({ message: 'Food item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Book a food token (Student)
exports.bookFoodToken = async (req, res) => {
  try {
    const { rollNo, foodItemId, bookingDate, quantity } = req.body;

    // Validate student roll number
    const student = await Student.findOne({ rollNo });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Validate food item
    const foodItem = await FoodItem.findById(foodItemId);
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    // Validate booking date
    const bookingDay = new Date(bookingDate).toLocaleString('en-us', { weekday: 'long' });
    if (!foodItem.availableDays.includes(bookingDay)) {
      return res.status(400).json({ message: `This food item is not available on ${bookingDay}` });
    }

    // Create a new food token
    const newFoodToken = new FoodToken({
      student: student._id,
      foodItem: foodItem._id,
      bookingDate,
      quantity,
    });
    await newFoodToken.save();
    res.status(201).json(newFoodToken);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Fetch all food tokens (Admin)
exports.getAllFoodTokens = async (req, res) => {
  try {
    const foodTokens = await FoodToken.find({}).populate('student').populate('foodItem');
    res.json(foodTokens);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a food token (Admin)
exports.deleteFoodToken = async (req, res) => {
  try {
    const { id } = req.params;
    await FoodToken.findByIdAndDelete(id);
    res.status(200).json({ message: 'Food token deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Automatically delete expired food tokens
exports.cleanupExpiredTokens = async () => {
  try {
    const today = new Date();
    await FoodToken.deleteMany({ bookingDate: { $lt: today }, status: 'pending' });
    console.log('Expired food tokens cleaned up');
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
  }
};
