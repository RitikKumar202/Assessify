const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs')
const path = require('path')
const { Parser } = require('json2csv')

// 6099fd4dd3f09b0015cb002b
const Tests = require('../models/test');

const connect = mongoose.connect(process.env.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
const adminRouter = express.Router();
const authenticate = require('../authenticate');
const Admin = require('../models/admin');
const { urlencoded } = require('body-parser');


adminRouter.use(bodyParser.json());
adminRouter.use(cors());

connect.then((db) => {
    console.log("Connected correctly to server");


    // Router to download csv file of test-results
    adminRouter.route('/resultDownload/:testId')
        .get(authenticate.verifyAdmin, (req, res, next) => {
            const testid = req.params.testId
            Tests.findById(`${testid}`).then(test => {
                var data = []
                for (let i = 0; i < test.studentMarks.length; i++) {
                    data.push({
                        sno: i + 1,
                        name: test.studentMarks[i].name,
                        uniqueID: test.studentMarks[i].uniqueID,
                        marks: test.studentMarks[i].marks,
                        negMarks: test.studentMarks[i].negativeMarks,
                        posMarks: test.studentMarks[i].positiveMarks,
                        totalMarks: test.totalMarks
                    })
                }
                const fields = [
                    {
                        label: 'S.No.',
                        value: 'sno'
                    },
                    {
                        label: 'ID',
                        value: 'uniqueID'
                    },
                    {
                        label: 'Name',
                        value: 'name'
                    },
                    {
                        label: 'Maximum Marks',
                        value: 'totalMarks'
                    }, {
                        label: 'Total Positive',
                        value: 'posMarks'
                    }, {
                        label: 'Total Negative',
                        value: 'negMarks'
                    },
                    {
                        label: 'Marks Obtained',
                        value: 'marks'
                    },

                ];
                var template = new Parser({ fields });
                var csvData = template.parse(data);
                res.header('Content-Type', 'text/csv');
                res.status(200).attachment(`results_${testid}.csv`).send(csvData);
            })
        })

    // Router to get group-wise lists of tests 
    adminRouter.route('/results/:testid')
        .get(authenticate.verifyAdmin, (req, res, next) => {
            Tests.findById(req.params.testid).then(test => {
                var response = []
                for (let i = 0; i < test.studentMarks.length; i++) {
                    response.push({
                        name: test.studentMarks[i].name,
                        uniqueID: test.studentMarks[i].uniqueID,
                        userID: test.studentMarks[i].userID,
                        marks: test.studentMarks[i].marks,
                        negMarks: test.studentMarks[i].negativeMarks,
                        posMarks: test.studentMarks[i].positiveMarks,
                        totalMarks: test.totalMarks
                    })
                }
                res.status(200).send(response)
            })
        })
    adminRouter.route('/evaluate')
        .post(authenticate.verifyAdmin, (req, res, next) => {
            console.log(req.body);

            Tests.findById(req.body.testid).then(async test => {
                test.studentMarks.map((student, i) => {
                    if (`${student.userID}` == req.body.studentId) {
                        student.marks = Number(student.marks) - student.answers[req.body.questionIndex].marks + Number(req.body.marks);
                        student.answers[req.body.questionIndex].marks = req.body.marks;
                        student.answers[req.body.questionIndex].remarks = req.body.remarks;
                        console.log(student);
                        console.log(req.body);
                        Tests.updateOne(
                            { _id: req.body.testid, 'studentMarks.userID': req.body.studentId },
                            {
                                $set: {
                                    'studentMarks.$': student
                                }
                            }
                        ).then(() => {
                            console.log(`Result : Question evaluated ${req.body.studentId} + ${req.body.questionIndex + 1}`)
                            res.redirect(`/admin/${req.body.testid}/getCompletedQuestions/${req.body.studentId}`)
                        })
                            .catch(err => console.log(`Error : ${err}`))
                    }
                })
            })
        })
        .put(authenticate.verifyAdmin, (req, res, next) => {

            Tests.findById(req.body.testid).then(async test => {
                test.studentMarks.map((student, i) => {
                    if (`${student.userID}` == req.body.studentId) {
                        student.isEvaluated = true;
                        Tests.updateOne(
                            { _id: req.body.testid, 'studentMarks.userID': req.body.studentId },
                            {
                                $set: {
                                    'studentMarks.$': student
                                }
                            }
                        ).then(() => {
                            console.log(`Result : Test evaluated ${req.body.studentId}`)
                            // res.redirect(`admin/${req.body.testid}/getCompletedQuestions/${req.body.studentId}`)
                            res.status(200).json({ Message: "Evaluation Complete" })
                        })
                            .catch(err => console.log(`Error : ${err}`))
                    }
                })
            })
        })
    adminRouter.route('/:testid/getCompletedQuestions/:studentId')
        .get(authenticate.verifyAdmin, (req, res, next) => {
            Tests.findById(req.params.testid).then(test => {
                var response
                for (var j = 0; j < test.studentMarks.length; j++) {
                    if (`${test.studentMarks[j].userID}` == req.params.studentId) {
                        response = {
                            title: test.title,
                            startDate: test.startDate,
                            duration: test.duration,
                            negative: test.negative,
                            negPercentage: test.negPercentage,
                            subject: test.subject,
                            isQuestionInPDF: test.isQuestionInPDF,
                            questions: test.questions,
                            isEvaluated: test.studentMarks[j].isEvaluated,
                            response: test.studentMarks[j].answers,
                            marksObtained: test.studentMarks[j].marks,
                            negMarks: test.studentMarks[j].negativeMarks,
                            posMarks: test.studentMarks[j].positiveMarks,
                            totalMarks: test.totalMarks,
                            totalQuestions: test.totalQuestions
                        }
                    }
                }
                // console.log(response);
                res.status(200).send(response)
            })
        })


    adminRouter.route('/:testId/testPaper')
        .get(authenticate.verifyAdmin, (req, res, next) => {
            console.log("File Request");
            Tests.findById(req.params.testId).then(test => {
                if (test.isQuestionInPDF) {
                    var filename = `static/${req.params.testId}.pdf`;
                    res.sendFile(path.join(__dirname, `/../../${filename}`))
                }
                else {
                    var response = {
                        questions: test.questions
                    }
                    res.status(200).send(response)
                }
            })
        })
    adminRouter.route('/:testId/testPaper/:studentId')
        .get(authenticate.verifyAdmin, (req, res, next) => {
            Tests.findById(req.params.testId).then(test => {
                var filename
                for (var j = 0; j < test.studentMarks.length; j++) {

                    if (`${test.studentMarks[j].userID}` == req.params.studentId) {
                        filename = `static/${req.params.studentId}_${req.params.testId}.pdf`
                    };
                    res.sendFile(path.join(__dirname, `/../../${filename}`))

                }
            })
        })

    adminRouter.route('/:testId/getEvaluationData/:studentId')
        .get(authenticate.verifyAdmin, (req, res, next) => {
            Tests.findById(req.params.testId).then(test => {
                var response
                for (var j = 0; j < test.studentMarks.length; j++) {
                    if (`${test.studentMarks[j].userID}` == req.params.studentId) {
                        response = {
                            title: test.title,
                            startDate: test.startDate,
                            duration: test.duration,
                            subject: test.subject,
                            negative: test.negative,
                            negPercentage: test.negPercentage,
                            isQuestionInPDF: test.isQuestionInPDF,
                            questions: test.questions,
                            isEvaluated: test.studentMarks[j].isEvaluated,
                            response: test.studentMarks[j].answers,
                            marksObtained: test.studentMarks[j].marks,
                            negMarks: test.studentMarks[i].negativeMarks,
                            posMarks: test.studentMarks[i].positiveMarks,
                            totalMarks: test.totalMarks,
                            totalQuestions: test.totalQuestions
                        }
                    }
                }
                console.log(response);
                res.status(200).send(response)
            })
        })



    adminRouter.route('/changepass')
        .put(authenticate.verifyAdmin, (req, res, next) => {
            Admin.findById(req.user._id).then((user) => {
                var oldpass = req.body.oldpass;
                var newpass = req.body.newpass;
                user.changePassword(oldpass, newpass, (err, user, passErr) => {
                    if (err) {
                        res.status(200).json({ success: false, error: err });
                    }
                    else if (user) {
                        var usertoSend = {
                            username: user.username,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            email: user.email,
                            organisation: user.oraganisation
                        }
                        var token = authenticate.getToken({ _id: user._id });
                        var response = {
                            success: true,
                            token: token,
                            status: 'Password Updated!',
                            user: usertoSend

                        }

                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(response);
                    }
                })
                user.save();

            }, err => next(err));
        })
});

module.exports = adminRouter;