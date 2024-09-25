const { ref, uploadBytes, getDownloadURL } = require('firebase/storage'); // Firebase storage functions
const { storage } = require('../firebaseConfig');
const FoodItem = require('../models/FoodItem');

// Add a food item (Admin)
exports.addFoodItem = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        const { name, availableDays } = req.body;

        // Check for necessary fields
        if (!name || !availableDays) {
            return res.status(400).json({ error: 'Name and availableDays are required' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Image is required' });
        }

        // Parse availableDays if it is a JSON string
        const parsedAvailableDays = typeof availableDays === 'string' ? JSON.parse(availableDays) : availableDays;

        // Create a reference to Firebase Storage
        const storageRef = ref(storage, `foodItems/${req.file.originalname}`);

        // Upload the file to Firebase Storage using buffer from Multer
        const snapshot = await uploadBytes(storageRef, req.file.buffer);

        // Get the download URL after uploading
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Create new food item with the download URL
        const newFoodItem = new FoodItem({
            name,
            image: downloadURL,  // Store the Firebase download URL
            availableDays: parsedAvailableDays
        });

        await newFoodItem.save();

        res.status(201).json(newFoodItem);
    } catch (error) {
        console.error('Error occurred while adding food item:', error);
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

// Fetch all food items (Admin & Students)
exports.getAllFoodItems = async (req, res) => {
    try {
        const foodItems = await FoodItem.find({});
        res.status(200).json(foodItems);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
