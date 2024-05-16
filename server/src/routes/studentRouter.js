const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const Groups = require('../models/group');
const Users = require('../models/user');
const Tests = require('../models/test');

const studentRouter = express.Router();
const authenticate = require('../authenticate');

studentRouter.use(bodyParser.json());
studentRouter.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected correctly to server"))
    .catch(err => console.log("MongoDB connection error:", err));

// Get group-wise lists of tests
studentRouter.get('/:groupid/getTestByGroup', authenticate.verifyUser, async (req, res, next) => {
    try {
        const group = await Groups.findById(req.params.groupid);
        const testInfoArray = await Promise.all(group.tests.map(async (testId) => {
            const test = await Tests.findById(testId);
            const isCompleted = test.studentMarks.some(mark => String(mark.userID) === String(req.user._id));
            return {
                _id: test._id,
                title: test.title,
                testType: test.testType,
                duration: test.duration,
                subject: test.subject,
                startDate: test.startDate,
                totalMarks: test.totalMarks,
                negative: test.negative,
                negPercentage: test.negPercentage,
                isCompleted: isCompleted
            };
        }));
        const response = {
            name: group.name,
            isPrivate: group.isPrivate,
            _id: group._id,
            tests: testInfoArray
        };
        res.status(200).send(response);
    } catch (error) {
        next(error);
    }
});

// Get completed-test-wise questions and response of respective student
studentRouter.get('/:testid/getCompletedQuestions', authenticate.verifyUser, async (req, res, next) => {
    try {
        const test = await Tests.findById(req.params.testid);
        const studentMark = test.studentMarks.find(mark => String(mark.userID) === String(req.user._id));
        if (!studentMark || Date.now() < (test.startDate.getTime() + (test.duration * 60000)) || !studentMark.isEvaluated) {
            throw { status: 401, message: "You are not authorized to see the results now. Try again later once test and evaluation finishes." };
        }
        const response = {
            title: test.title,
            startDate: test.startDate,
            testType: test.testType,
            negative: test.negative,
            negPercentage: test.negPercentage,
            duration: test.duration,
            subject: test.subject,
            questions: test.questions,
            response: studentMark.answers,
            marksObtained: studentMark.marks,
            totalPositive: studentMark.positiveMarks,
            totalNegative: studentMark.negativeMarks,
            isQuestionInPDF: test.isQuestionInPDF,
            totalMarks: test.totalMarks
        };
        res.status(200).send(response);
    } catch (error) {
        next(error);
    }
});

// Serve test paper
studentRouter.get('/:testId/testPaper', authenticate.verifyUser, async (req, res, next) => {
    try {
        const test = await Tests.findById(req.params.testId);
        if (test.isQuestionInPDF) {
            const filename = `static/${req.params.testId}.pdf`;
            res.sendFile(path.join(__dirname, `../../${filename}`));
        } else {
            const response = { questions: test.questions };
            res.status(200).send(response);
        }
    } catch (error) {
        next(error);
    }
});

// Serve test response
studentRouter.get('/:testId/testresponse', authenticate.verifyUser, async (req, res, next) => {
    try {
        const test = await Tests.findById(req.params.testId);
        const studentMark = test.studentMarks.find(mark => String(mark.userID) === String(req.user._id));
        if (studentMark) {
            const filename = `static/${req.user._id}_${req.params.testId}.pdf`;
            res.sendFile(path.join(__dirname, `../../${filename}`));
        }
    } catch (error) {
        next(error);
    }
});

// Change password
studentRouter.put('/changepass', authenticate.verifyUser, async (req, res, next) => {
    try {
        const user = await Users.findById(req.user._id);
        const oldpass = req.body.oldpass;
        const newpass = req.body.newpass;
        user.changePassword(oldpass, newpass, (err, user, passErr) => {
            if (err) {
                res.status(400).json({ success: false, error: err });
            } else if (user) {
                const usertoSend = {
                    username: user.username,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                };
                const token = authenticate.getToken({ _id: user._id });
                const response = {
                    success: true,
                    token: token,
                    status: 'Password Updated!',
                    user: usertoSend
                };
                res.status(200).json(response);
            }
        });
        await user.save();
    } catch (error) {
        next(error);
    }
});

module.exports = studentRouter;
