const twilio = require("twilio");
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const IVRSApply = require('../models/IVRSApply');
const Student = require('../models/Student');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const makeTwilioCall = async (toPhoneNumber, fromPhoneNumber, twimlUrl) => {
    return client.calls.create({
        to: toPhoneNumber,
        from: fromPhoneNumber,
        url: twimlUrl,
    });
};

const generateTwimlGather = (actionUrl) => {
    const twiml = new VoiceResponse();
    const gather = twiml.gather({
        input: 'dtmf',
        numDigits: 1,
        action: actionUrl
    });
    gather.say('Press 1 for English or press 2 for Tamil.');
    return twiml.toString();
};

exports.createApplication = async (req, res) => {
    const { studentRollNo, fromDate, toDate } = req.body;

    try {
        const newApplication = new IVRSApply({
            studentRollNo,
            fromDate,
            toDate,
            status: 'Pending',
            callCount: 0,
        });

        await newApplication.save();

        res.status(201).json({
            message: 'Application created successfully',
            applicationId: newApplication._id,
            success: 1
        });

        await startCall(newApplication._id);

    } catch (error) {
        console.error('Error saving application: ', error);
        res.status(500).json({ message: 'Error saving application' });
    }
};

const startCall = async (applicationId) => {
    try {
        const application = await IVRSApply.findById(applicationId);
        if (!application) {
            throw new Error('Application not found');
        }

        const student = await Student.findOne({ rollNo: application.studentRollNo });
        if (!student) {
            throw new Error('Student not found');
        }

        const parentPhoneNo = student.secondaryMobileNumber;
        const actionUrl = `http://localhost:3000/api/ivrs/select-language/${application._id}`;

        await makeTwilioCall("+919994554261", process.env.TWILIO_PHONE_NUMBER, actionUrl);

    } catch (error) {
        console.error('Error in IVRS call: ', error);
        throw new Error('Error in IVRS call');
    }
};

// Handle language selection and read leave details
exports.selectLanguage = async (req, res) => {
    const { applicationId } = req.params;
    const digits = req.body.Digits;

    const twiml = new VoiceResponse();

    try {
        const application = await IVRSApply.findById(applicationId);
        if (!application) {
            return res.status(404).send('Application not found');
        }

        let leaveMessage;
        if (digits == '1') {
            leaveMessage = `Your leave details are from ${application.fromDate} to ${application.toDate}. Press 1 to confirm or 0 to cancel the leave.`;
        } else if (digits == '2') {
            leaveMessage = `உங்கள் விடுப்பு விவரங்கள் ${application.fromDate} முதல் ${application.toDate} வரை உள்ளன. விடுப்பை உறுதிப்படுத்த 1 ஐ அழுத்தவும், ரத்து செய்ய 0 ஐ அழுத்தவும்.`;
        } else {
            twiml.say('Invalid input. Please try again.');
            res.type('text/xml');
            return res.send(twiml.toString());
        }

        const gather = twiml.gather({
            input: 'dtmf',
            numDigits: 1,
            action: `/api/ivrs/confirm-leave/${application._id}`
        });
        gather.say(leaveMessage);
        res.type('text/xml');
        res.send(twiml.toString());

    } catch (error) {
        console.error('Error handling language selection: ', error);
        res.status(500).send('Error in IVRS');
    }
};

// Confirm or decline the leave
exports.confirmLeave = async (req, res) => {
    const { applicationId } = req.params;
    const digits = req.body.Digits;

    const twiml = new VoiceResponse();

    try {
        const application = await IVRSApply.findById(applicationId);
        if (!application) {
            return res.status(404).send('Application not found');
        }

        if (digits == '1') {
            application.status = 'Confirmed';
            await application.save();
            twiml.say('Your leave has been confirmed.');
        } else if (digits == '0') {
            application.status = 'Cancelled';
            await application.save();
            twiml.say('Your leave has been cancelled.');
        } else {
            twiml.say('Invalid input.');
        }

        res.type('text/xml');
        res.send(twiml.toString());

    } catch (error) {
        console.error('Error in confirming leave: ', error);
        res.status(500).send('Error in IVRS confirmation');
    }
};

// Other routes...

// Get the leave status of a student
exports.getLeaveStatus = async (req, res) => {
    const { studentId } = req.params;

    try {
        const application = await IVRSApply.findOne({ studentRollNo: studentId }).sort({ createdAt: -1 });
        if (!application) {
            return res.status(404).json({ message: 'No leave applications found' });
        }

        res.status(200).json({ status: application.status });
    } catch (error) {
        console.error('Error fetching leave status: ', error);
        res.status(500).json({ message: 'Error fetching leave status' });
    }
};

// Get the call count for a specific leave application
exports.getCallCount = async (req, res) => {
    const { applicationId } = req.params;

    try {
        const application = await IVRSApply.findById(applicationId);
        if (!application) {
            return res.status(404).send('Application not found');
        }

        const callCount = application.callCount || 0;
        res.status(200).json({ callCount });
    } catch (error) {
        console.error('Error fetching call count: ', error);
        res.status(500).send('Error fetching call count');
    }
};

// Increment the call count for a specific leave application
exports.incrementCallCount = async (req, res) => {
    const { applicationId } = req.params;

    try {
        const application = await IVRSApply.findById(applicationId);
        if (!application) {
            return res.status(404).send('Application not found');
        }

        application.callCount = (application.callCount || 0) + 1;
        await application.save();

        res.status(200).send('Call count incremented');
    } catch (error) {
        console.error('Error incrementing call count: ', error);
        res.status(500).send('Error incrementing call count');
    }
};
