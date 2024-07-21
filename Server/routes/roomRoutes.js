const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomControllers');

router.post('/', roomController.addRoom);
router.get('/', roomController.getRooms);

module.exports = router;
