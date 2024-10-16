const FoodToken = require('../models/FoodToken');
const QRCode = require('qrcode');
const moment = require('moment');
const Student = require('../models/Student');
const mongoose = require('mongoose');
const FoodItem = require('../models/FoodItem');


exports.bookFoodToken = async (req, res) => {
    try {
        const { foodItemName, quantity, bookingDate } = req.body;
        const studentRollNo = req.user.rollNo;

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
        const bookingMoment = moment(bookingDate);
        const bookingDay = bookingMoment.format('dddd');
        if (!foodItem.availableDays.includes(bookingDay)) {
            return res.status(400).json({ message: 'Food item is not available on the selected day' });
        }

        // Get the current time and the end of today's day
        const currentTime = moment();
        const tomorrow = moment().add(1, 'day').startOf('day');
        const after5PM = moment().hour(17).minute(0);

        // Check if booking date is tomorrow and if it's after 5 PM today
        if (bookingMoment.isSame(tomorrow, 'day') && currentTime.isAfter(after5PM)) {
            return res.status(400).json({ message: 'Cannot book tokens for tomorrow after 5 PM' });
        }

        // Calculate the total amount
        const totalAmount = foodItem.price * quantity;
        const studentBalance = parseFloat(student.amount);

        // Check if the student has sufficient balance
        if (studentBalance < totalAmount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Deduct the amount from the student's balance
        student.amount = (studentBalance - totalAmount).toString();
        await student.save();

        // Create a new food token
        const token = new FoodToken({
            student: student._id,
            foodItemName: foodItemName,
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


exports.cancelFoodToken = async (req, res) => {
    try {
        const { tokenId } = req.params;
        const studentId = req.user.id;

        // Find the token to get details about the food item and quantity
        const token = await FoodToken.findOne({ _id: tokenId, student: studentId });
        if (!token) {
            return res.status(404).json({ message: 'Token not found or not authorized to cancel' });
        }

        const currentDate = moment();
        const bookingDate = moment(token.bookingDate);
        const tomorrow = moment().add(1, 'day').startOf('day');
        const after5PM = moment().hour(17).minute(0);

        // If the token is booked for tomorrow, cancel only if it's before 5 PM today
        if (bookingDate.isSame(tomorrow, 'day') && currentDate.isAfter(after5PM)) {
            return res.status(403).json({ message: 'Cancellation is no longer allowed after 5:00 PM the day before' });
        }

        // Find the food item to get its price
        const foodItem = await FoodItem.findOne({ name: token.foodItemName });
        if (!foodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        // Calculate the total amount to add back
        const totalAmountToAddBack = foodItem.price * token.quantity;

        // Find the student and update the amount
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const studentBalance = parseFloat(student.amount);
        student.amount = (studentBalance + totalAmountToAddBack).toString();
        await student.save();

        // Remove the token
        await FoodToken.findByIdAndDelete(tokenId);

        res.status(200).json({ message: 'Food token canceled successfully' });
    } catch (err) {
        console.error('Error canceling food token:', err);
        res.status(500).json({ message: 'Error canceling food token', error: err.message || 'Unknown error' });
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

        
        // Find the token
        const token = await FoodToken.findOne({ _id: tokenId });

        if (!token) {
            return res.status(404).json({ message: 'Token not found or not valid' });
        }

        // Generate QR code
        const qrCodeData = await QRCode.toDataURL(`${tokenId}`);
        
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

// Get token details by token ID
exports.getTokenDetails = async (req, res) => {
    try {
        const { tokenId } = req.params;

        // Validate tokenId format
        if (!mongoose.Types.ObjectId.isValid(tokenId)) {
            return res.status(400).json({ message: 'Invalid Token ID format' });
        }

        // Find the token details
        const token = await FoodToken.findById(tokenId).populate('foodItemName', 'name price'); // Populate food item details if needed

        if (!token) {
            return res.status(404).json({ message: 'Token not found' });
        }

        // Return token details
        res.status(200).json({ token });
    } catch (err) {
        console.error('Error fetching token details:', err);
        res.status(500).json({ message: 'Error fetching token details', error: err.message || 'Unknown error' });
    }
};

// Admin - Get billing information: total quantity and cost per food item for tomorrow's bookings
exports.adminBilling = async (req, res) => {
    try {
        // Get tomorrow's date (assuming bookingDate is stored as a Date object)
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0); // Set time to 00:00:00 for start of the day
        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(tomorrow.getDate() + 1); // Get day after tomorrow to use as end boundary

        // Aggregate food tokens to calculate total quantity and total cost per food item for tomorrow's bookings
        const billingData = await FoodToken.aggregate([
            {
                $match: {
                    bookingDate: { 
                        $gte: tomorrow, // Only include bookings from the start of tomorrow
                        $lt: dayAfterTomorrow // Exclude bookings after tomorrow
                    }
                }
            },
            {
                $lookup: {
                    from: 'fooditems', // Join with FoodItem collection
                    localField: 'foodItemName',
                    foreignField: 'name', // Assuming 'name' is the field in FoodItem schema
                    as: 'foodDetails'
                }
            },
            {
                $unwind: '$foodDetails' // Unwind the foodDetails array to get individual item details
            },
            {
                $group: {
                    _id: "$foodItemName", // Group by foodItemName
                    totalQuantity: { $sum: "$quantity" }, // Sum the quantity for each food item
                    price: { $first: "$foodDetails.price" }, // Get the price from the FoodItem collection
                }
            },
            {
                $project: {
                    foodItemName: "$_id", // Rename _id to foodItemName
                    totalQuantity: 1, // Include the total quantity
                    price: 1, // Include the price of the food item
                    totalCost: { $multiply: ["$totalQuantity", "$price"] } // Calculate total cost per item
                }
            },
            {
                $group: {
                    _id: "$foodItemName", // Ensure final grouping by food item
                    totalQuantity: { $sum: "$totalQuantity" }, // Sum quantities across potential duplicates
                    price: { $first: "$price" }, // Use the first price (should be the same for all)
                    totalCost: { $sum: "$totalCost" } // Sum the total costs across duplicates
                }
            }
        ]);

        if (billingData.length === 0) {
            return res.status(404).json({ message: 'No billing data found for tomorrow' });
        }

        // Respond with the billing data for tomorrow's bookings
        res.status(200).json({ billingData });
    } catch (err) {
        console.error('Error fetching billing data:', err);
        res.status(500).json({ message: 'Error fetching billing data', error: err.message || 'Unknown error' });
    }
};
