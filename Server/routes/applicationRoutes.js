const express = require('express');
const { assignRoomIfPaid } = require('../controllers/applicationControllers');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/apply', auth, assignRoomIfPaid);

module.exports = router;
