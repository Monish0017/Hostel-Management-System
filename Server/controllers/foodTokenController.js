const FoodToken = require('../models/FoodToken');
const QRCode = require('qrcode');
const moment = require('moment');
const Student = require('../models/Student');
const mongoose = require('mongoose');
const FoodItem = require('../models/FoodItem');


exports.bookFoodToken = async (req, res) => {
    try {
        const { foodItemName, quantity, bookingDate } = req.body;
        const studentRollNo = req.user.rollNo; // Extract rollNo from the authenticated user

        // Find the student by rollNo
        const student = await Student.findOne({ rollNo: studentRollNo });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Ensure that the food item exists
        const foodItem = await FoodItem.findOne({ name: foodItemName });
        if (!foodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        // Check if the food item is available on the booking date
        const bookingDay = moment(bookingDate).format('dddd'); // Get the day of the week (e.g., "Monday")
        if (!foodItem.availableDays.includes(bookingDay)) {
            return res.status(400).json({ message: 'Food item is not available' });
        }

        // Create a new food token
        const token = new FoodToken({
            student: student._id, // Use student._id
            foodItemName: foodItemName, // Store food item name
            quantity: quantity,
            bookingDate: bookingDate
        });

        await token.save();
        res.status(201).json({ message: 'Food token booked successfully', token });
    } catch (err) {
        console.error('Error booking food token:', err);
        res.status(500).json({ message: 'Error booking food token', error: err.message || 'Unknown error' });
    }
};

// Cancel a food token
exports.cancelFoodToken = async (req, res) => {
    try {
        const { tokenId } = req.params;
        const studentId = req.user.id;

        // Find and remove the token
        const result = await FoodToken.findOneAndDelete({ _id: tokenId, student: studentId });

        if (!result) {
            return res.status(404).json({ message: 'Token not found or not authorized to cancel' });
        }

        res.status(200).json({ message: 'Food token canceled successfully' });
    } catch (err) {
        console.error('Error canceling food token:', err);
        res.status(500).json({ message: 'Error canceling food token', error: err.message || 'Unknown error' });
    }
};

// Clear food tokens based on token ID
exports.clearTokens = async (req, res) => {
    try {
        const { tokenId } = req.body;

        // Check if tokenId is provided
        if (!tokenId) {
            return res.status(400).json({ message: 'Token ID is required' });
        }

        // Validate tokenId format
        if (!mongoose.Types.ObjectId.isValid(tokenId)) {
            return res.status(400).json({ message: 'Invalid Token ID format' });
        }

        // Delete the token from the database
        const result = await FoodToken.deleteOne({ _id: tokenId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Token not found' });
        }

        res.status(200).json({ message: 'Token cleared successfully' });
    } catch (err) {
        console.error('Error clearing tokens:', err);
        res.status(500).json({ message: 'Error clearing tokens', error: err.message || 'Unknown error' });
    }
};


// Generate QR code for a food token
exports.generateQRCode = async (req, res) => {
    try {
        const { tokenId } = req.params;

        // Check if tokenId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(tokenId)) {
            return res.status(400).json({ message: 'Invalid token ID' });
        }

        const studentId = req.user.id;

        // Find the token
        const token = await FoodToken.findOne({ _id: tokenId, student: studentId });

        if (!token) {
            return res.status(404).json({ message: 'Token not found or not valid' });
        }

        // Generate QR code
        const qrCodeData = await QRCode.toDataURL(`TokenID:${tokenId},Item:${token.foodItemName},Quantity:${token.quantity}`);
        
        res.status(200).json({ qrCode: qrCodeData });
    } catch (err) {
        console.error('Error generating QR code:', err);
        res.status(500).json({ message: 'Error generating QR code', error: err.message || 'Unknown error' });
    }
};

// Cleanup expired tokens
exports.cleanupExpiredTokens = async (req, res) => {
    try {
        // Find and delete expired tokens
        const result = await FoodToken.deleteMany({ bookingDate: { $lt: moment().startOf('day').toDate() } });
        
        res.status(200).json({ message: 'Expired tokens cleaned up successfully', deletedCount: result.deletedCount });
    } catch (err) {
        console.error('Error cleaning up expired tokens:', err);
        res.status(500).json({ message: 'Error cleaning up expired tokens', error: err.message || 'Unknown error' });
    }
};

// Admin validate token
exports.adminValidateToken = async (req, res) => {
    try {
        const { tokenId, studentId } = req.body;

        // Validate tokenId and studentId
        if (!mongoose.Types.ObjectId.isValid(tokenId) || !mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Invalid token ID or student ID' });
        }

        // Find the token
        const token = await FoodToken.findOne({ _id: tokenId, student: studentId });

        if (!token) {
            return res.status(404).json({ message: 'Token not found or not valid' });
        }

        // Example: Mark token as validated
        // token.validated = true;
        await token.save();

        res.status(200).json({ message: 'Token validated successfully', token });
    } catch (err) {
        console.error('Error validating token:', err);
        res.status(500).json({ message: 'Error validating token', error: err.message || 'Unknown error' });
    }
};

// Get tokens booked by the authenticated student
exports.getStudentTokens = async (req, res) => {
    try {
        const studentId = req.user.id;
        console.log(studentId)
        // Find all tokens for the student
        const tokens = await FoodToken.find({ student: studentId });

        if (tokens.length === 0) {
            return res.status(404).json({ message: 'No tokens found for the student' });
        }

        res.status(200).json({ tokens });
    } catch (err) {
        console.error('Error fetching student tokens:', err);
        res.status(500).json({ message: 'Error fetching student tokens', error: err.message || 'Unknown error' });
    }
};
