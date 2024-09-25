// routes/ivrsRoutes.js

const express = require('express');
const callController = require('../controllers/callController');
const auth = require('../middleware/auth');

const router = express.Router();

// Other routes
router.post('/create-application', auth, callController.createApplication);
router.post('/select-language/:applicationId', auth, callController.selectLanguage);
router.post('/confirm-leave/:applicationId', auth, callController.confirmLeave);
router.get('/leave-status/:applicationId', auth, callController.getLeaveStatus);
router.get('/call-count/:applicationId', auth, callController.getCallCount);
router.post('/increment-call-count/:applicationId', auth, callController.incrementCallCount);

module.exports = router;
