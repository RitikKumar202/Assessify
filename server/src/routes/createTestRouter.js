const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs').promises;

const Groups = require('../models/group');
const Users = require('../models/user');
const Admins = require('../models/admin');
const Tests = require('../models/test');
const authenticate = require('../authenticate');

const createTestRouter = express.Router();

mongoose.connect(process.env.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected correctly to server");

        createTestRouter.use(bodyParser.json());

        createTestRouter.route('/:groupId')
            .post(authenticate.verifyAdmin, async (req, res, next) => {
                try {
                    const test = await Tests.create({
                        title: req.body.title,
                        createdBy: req.user._id,
                        duration: req.body.duration,
                        subject: req.body.subject,
                        startDate: req.body.startDate,
                        testType: req.body.testType,
                        isQuestionInPDF: req.body.isQuestionInPDF,
                        totalQuestions: req.body.totalQuestions,
                        totalMarks: req.body.totalMarks,
                        negative: req.body.negative,
                        negPercentage: req.body.negPercentage
                    });

                    const group = await Groups.findById(req.params.groupId);
                    group.tests.push(test._id);
                    await group.save();

                    res.status(200).json(test);
                } catch (err) {
                    next(err);
                }
            });

        createTestRouter.route('/uploadAssignment/:testId')
            .post(authenticate.verifyAdmin, async (req, res, next) => {
                try {
                    const test = await Tests.findById(req.params.testId);
                    const file = req.files.file.data;
                    const filename = `static/${req.params.testId}.pdf`;
                    await fs.writeFile(filename, file);
                    test.questionPDF = filename;
                    test.totalQuestions = req.body.totalQuestions;
                    test.totalMarks = req.body.totalMarks;
                    await test.save();
                    res.status(200).json(test);
                } catch (err) {
                    console.log(err);
                    res.status(609).json({ error: err });
                }
            });

        createTestRouter.route('/edit/:testId')
            .put(authenticate.verifyAdmin, async (req, res, next) => {
                try {
                    await Tests.findByIdAndUpdate(req.params.testId, {
                        $set: {
                            title: req.body.title,
                            duration: req.body.duration,
                            subject: req.body.subject,
                            startDate: req.body.startDate,
                            testType: req.body.testType,
                            negative: req.body.negative,
                            negPercentage: req.body.negPercentage,
                        }
                    });
                    const test = await Tests.findById(req.params.testId);
                    res.status(200).json(test);
                } catch (err) {
                    next(err);
                }
            });

        createTestRouter.route('/edit/:testId')
            .delete(authenticate.verifyAdmin, async (req, res, next) => {
                try {
                    const groupId = req.body.groupId;
                    await Tests.findByIdAndRemove(req.params.testId);
                    await Groups.findByIdAndUpdate(groupId, { $pull: { tests: req.params.testId } });
                    res.status(200).json({ message: "Deleted Successfully" });
                } catch (err) {
                    next(err);
                }
            });

        createTestRouter.route('/:testId/question')
            .post(authenticate.verifyAdmin, async (req, res, next) => {
                try {
                    let question;
                    if (req.body.questionType === '1') {
                        question = {
                            questionNo: req.body.questionNo,
                            question: req.body.question,
                            questionType: req.body.questionType,
                            A: req.body.A,
                            B: req.body.B,
                            C: req.body.C,
                            D: req.body.D,
                            ans: req.body.ans,
                            marks: req.body.marks,
                        };
                    } else {
                        question = {
                            questionNo: req.body.questionNo,
                            question: req.body.question,
                            questionType: req.body.questionType,
                            marks: req.body.marks,
                        };
                    }
                    const test = await Tests.findById(req.params.testId);
                    test.totalMarks += Number(question.marks);
                    test.totalQuestions += 1;
                    test.questions.push(question);
                    await test.save();
                    res.status(200).json(test);
                } catch (err) {
                    next(err);
                }
            });

        createTestRouter.route('/:testId/question')
            .put(authenticate.verifyAdmin, async (req, res, next) => {
                try {
                    let question;
                    if (req.body.questionType === '1') {
                        question = {
                            questionType: req.body.questionType,
                            questionNo: req.body.questionNo,
                            question: req.body.question,
                            A: req.body.A,
                            B: req.body.B,
                            C: req.body.C,
                            D: req.body.D,
                            ans: req.body.ans,
                            marks: req.body.marks,
                        };
                    } else {
                        question = {
                            questionType: req.body.questionType,
                            questionNo: req.body.questionNo,
                            question: req.body.question,
                            marks: req.body.marks,
                        };
                    }
                    const test = await Tests.findById(req.params.testId);
                    test.totalMarks = req.body.totalMarks;
                    test.questions[question.questionNo - 1] = question;
                    await test.save();
                    res.status(200).json(test);
                } catch (err) {
                    next(err);
                }
            });

        createTestRouter.route('/:testId/question')
            .delete(authenticate.verifyAdmin, async (req, res, next) => {
                try {
                    const qno = req.body.questionNo;
                    const test = await Tests.findById(req.params.testId);
                    test.totalMarks -= test.questions[qno - 1].marks;
                    test.totalQuestions--;
                    test.questions.splice(qno - 1, 1);
                    for (let i = 0; i < test.questions.length; i++) {
                        test.questions[i].questionNo = i + 1;
                    }
                    await test.save();
                    res.status(200).json(test);
                } catch (err) {
                    next(err);
                }
            });

        createTestRouter.route('/:testId')
            .get(authenticate.verifyAdmin, async (req, res, next) => {
                try {
                    const test = await Tests.findById(req.params.testId);
                    res.status(200).json(test);
                } catch (err) {
                    next(err);
                }
            });
    })
    .catch((err) => {
        console.log(err);
    });

module.exports = createTestRouter;
