const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const Groups = require('../models/group');
const Tests = require('../models/test');
const authenticate = require('../authenticate');

const testRouter = express.Router();

testRouter.use(bodyParser.json());
testRouter.use(cors());

mongoose.connect(process.env.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected correctly to server"))
    .catch(err => console.log(`Connection error: ${err}`));

testRouter.get('/:groupid/start/:testid', authenticate.verifyUser, async (req, res, next) => {
    try {
        const group = await Groups.findById(req.params.groupid);
        const student = group.members.find(member => String(member.userID) === String(req.user._id));

        if (!student) {
            return res.status(403).json({ message: "You are not authorized to start this test." });
        }

        const test = await Tests.findById(req.params.testid);
        const remainingTime = test.startDate.getTime() + (test.duration * 60000);

        let response;

        if (test.startDate > Date.now()) {
            response = { totalNumberOfQuestions: 0, remainingTime: Date.now(), message: "Not started yet" };
        } else if (Date.now() >= remainingTime) {
            response = { totalNumberOfQuestions: 0, remainingTime: Date.now(), message: "Test already ended" };
        } else if (test.studentMarks.some(mark => String(mark.userID) === String(req.user._id))) {
            response = { totalNumberOfQuestions: 0, remainingTime: Date.now(), message: "Test already attempted once" };
        } else {
            const NoOfQuestions = test.questions.length || test.totalQuestions;

            student.answers = Array.from({ length: NoOfQuestions }, (_, index) => ({ questionNo: index + 1 }));
            if (test.testType === '1') {
                student.isEvaluated = true;
            }

            await Tests.updateOne({ _id: req.params.testid }, { $addToSet: { studentMarks: student } });

            response = { totalNumberOfQuestions: NoOfQuestions, isQuestionInPDF: test.isQuestionInPDF, remainingTime, message: '' };
        }

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

testRouter.get('/:testId/testPaper', authenticate.verifyUser, async (req, res, next) => {
    try {
        const test = await Tests.findById(req.params.testId);
        if (test.isQuestionInPDF) {
            const filename = `static/${req.params.testId}.pdf`;
            res.sendFile(path.join(__dirname, `/../../${filename}`));
        } else {
            res.status(200).json({ questions: test.questions });
        }
    } catch (error) {
        next(error);
    }
});

testRouter.get('/:testid/:qno', authenticate.verifyUser, async (req, res, next) => {
    try {
        const test = await Tests.findById(req.params.testid);
        const question = test.questions[req.params.qno];

        if (question) {
            const formattedQuestion = {
                number: question.questionNo,
                questionType: question.questionType,
                question: question.question,
                marks: question.marks
            };

            if (question.questionType === '1') {
                formattedQuestion.A = question.A;
                formattedQuestion.B = question.B;
                formattedQuestion.C = question.C;
                formattedQuestion.D = question.D;
            }

            res.status(200).json(formattedQuestion);
        } else {
            res.status(200).json("Completed !!!");
        }
    } catch (error) {
        next(error);
    }
});

testRouter.post('/:testId/uploadAssignment', authenticate.verifyUser, async (req, res, next) => {
    try {
        const test = await Tests.findById(req.params.testId);
        const fileData = req.files.file.data;
        const filename = `static/${req.user._id}_${req.params.testId}.pdf`;

        await fs.writeFile(filename, fileData);

        const studentMarkIndex = test.studentMarks.findIndex(mark => String(mark.userID) === String(req.user._id));
        if (studentMarkIndex !== -1) {
            await Tests.updateOne({ _id: req.params.testId, 'studentMarks.userID': req.user._id }, { $set: { 'studentMarks.$.file': filename } });
            res.status(200).json('Response added successfully');
        } else {
            throw new Error("Student mark not found for the given test ID and user ID.");
        }
    } catch (error) {
        next(error);
    }
});

testRouter.post('/:testid/next/:qno', authenticate.verifyUser, async (req, res, next) => {
    try {
        const response = req.body.ans;
        const test = await Tests.findById(req.params.testid);
        const student = test.studentMarks.find(mark => String(mark.userID) === String(req.user._id));

        if (!student) {
            return res.status(403).json({ message: "You are not authorized to submit answers for this test." });
        }

        if (req.params.qno > 1) {
            const questionIndex = req.params.qno - 1;
            const obj = {
                questionNo: req.params.qno - 1,
                markedAns: response
            };

            if (student.answers[questionIndex].markedAns !== obj.markedAns) {
                student.answers[questionIndex].markedAns = obj.markedAns;

                if (test.questions[questionIndex].questionType === '1') {
                    const question = test.questions[questionIndex];

                    if (response === question.ans) {
                        student.answers[questionIndex].marks = question.marks;
                        student.marks += question.marks;
                        student.positiveMarks += question.marks;
                    } else if (test.negative) {
                        const negP = Number(test.negPercentage) / 100;
                        const negMarks = negP * Number(question.marks);
                        student.answers[questionIndex].marks = -1 * negMarks;
                        student.marks -= negMarks;
                        student.negativeMarks += negMarks;
                    }
                }

                await Tests.updateOne({ _id: req.params.testid, 'studentMarks.userID': req.user._id }, { $set: { 'studentMarks.$': student } });
            }
        }

        if (test.questions.length === req.params.qno - 1) {
            res.status(200).json({ finished: true, Message: "Test has been successfully completed" });
        } else {
            res.redirect(`/tests/${req.params.testid}/${req.params.qno - 1}`);
        }
    } catch (error) {
        next(error);
    }
});

module.exports = testRouter;
