const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const { Parser } = require('json2csv');
const Tests = require('../models/test');
const authenticate = require('../authenticate');
const Admin = require('../models/admin');

const adminRouter = express.Router();

adminRouter.use(bodyParser.json());
adminRouter.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected correctly to server"))
    .catch(err => console.log("Connection error: ", err));

// Download CSV file of test-results
adminRouter.get('/resultDownload/:testId', authenticate.verifyAdmin, async (req, res) => {
    try {
        const test = await Tests.findById(req.params.testId);
        const data = test.studentMarks.map((student, i) => ({
            sno: i + 1,
            name: student.name,
            uniqueID: student.uniqueID,
            marks: student.marks,
            negMarks: student.negativeMarks,
            posMarks: student.positiveMarks,
            totalMarks: test.totalMarks
        }));

        const fields = [
            { label: 'S.No.', value: 'sno' },
            { label: 'ID', value: 'uniqueID' },
            { label: 'Name', value: 'name' },
            { label: 'Maximum Marks', value: 'totalMarks' },
            { label: 'Total Positive', value: 'posMarks' },
            { label: 'Total Negative', value: 'negMarks' },
            { label: 'Marks Obtained', value: 'marks' }
        ];

        const parser = new Parser({ fields });
        const csvData = parser.parse(data);

        res.header('Content-Type', 'text/csv');
        res.status(200).attachment(`results_${req.params.testId}.csv`).send(csvData);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get group-wise lists of tests
adminRouter.get('/results/:testid', authenticate.verifyAdmin, async (req, res) => {
    try {
        const test = await Tests.findById(req.params.testid);
        const response = test.studentMarks.map(student => ({
            name: student.name,
            uniqueID: student.uniqueID,
            userID: student.userID,
            marks: student.marks,
            negMarks: student.negativeMarks,
            posMarks: student.positiveMarks,
            totalMarks: test.totalMarks
        }));
        res.status(200).json(response);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Evaluate test
adminRouter.post('/evaluate', authenticate.verifyAdmin, async (req, res) => {
    try {
        const test = await Tests.findById(req.body.testid);
        test.studentMarks.forEach(student => {
            if (student.userID === req.body.studentId) {
                student.marks -= student.answers[req.body.questionIndex].marks;
                student.marks += Number(req.body.marks);
                student.answers[req.body.questionIndex].marks = req.body.marks;
                student.answers[req.body.questionIndex].remarks = req.body.remarks;
            }
        });
        await test.save();
        res.redirect(`/admin/${req.body.testid}/getCompletedQuestions/${req.body.studentId}`);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Mark test as evaluated
adminRouter.put('/evaluate', authenticate.verifyAdmin, async (req, res) => {
    try {
        const test = await Tests.findById(req.body.testid);
        test.studentMarks.forEach(student => {
            if (student.userID === req.body.studentId) {
                student.isEvaluated = true;
            }
        });
        await test.save();
        res.status(200).json({ message: "Evaluation Complete" });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get completed questions of a student
adminRouter.get('/:testid/getCompletedQuestions/:studentId', authenticate.verifyAdmin, async (req, res) => {
    try {
        const test = await Tests.findById(req.params.testid);
        let response;
        test.studentMarks.forEach(student => {
            if (student.userID === req.params.studentId) {
                response = {
                    title: test.title,
                    startDate: test.startDate,
                    duration: test.duration,
                    negative: test.negative,
                    negPercentage: test.negPercentage,
                    subject: test.subject,
                    isQuestionInPDF: test.isQuestionInPDF,
                    questions: test.questions,
                    isEvaluated: student.isEvaluated,
                    response: student.answers,
                    marksObtained: student.marks,
                    negMarks: student.negativeMarks,
                    posMarks: student.positiveMarks,
                    totalMarks: test.totalMarks,
                    totalQuestions: test.totalQuestions
                };
            }
        });
        res.status(200).json(response);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get test paper
adminRouter.get('/:testId/testPaper', authenticate.verifyAdmin, async (req, res) => {
    try {
        const test = await Tests.findById(req.params.testId);
        if (test.isQuestionInPDF) {
            const filename = `static/${req.params.testId}.pdf`;
            res.sendFile(path.join(__dirname, `/../../${filename}`));
        } else {
            const response = { questions: test.questions };
            res.status(200).json(response);
        }
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get test paper for a student
adminRouter.get('/:testId/testPaper/:studentId', authenticate.verifyAdmin, async (req, res) => {
    try {
        const test = await Tests.findById(req.params.testId);
        let filename;
        test.studentMarks.forEach(student => {
            if (student.userID === req.params.studentId) {
                filename = `static/${req.params.studentId}_${req.params.testId}.pdf`;
            }
        });
        res.sendFile(path.join(__dirname, `/../../${filename}`));
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get evaluation data for a student
adminRouter.get('/:testId/getEvaluationData/:studentId', authenticate.verifyAdmin, async (req, res) => {
    try {
        const test = await Tests.findById(req.params.testId);
        let response;
        test.studentMarks.forEach(student => {
            if (student.userID === req.params.studentId) {
                response = {
                    title: test.title,
                    startDate: test.startDate,
                    duration: test.duration,
                    subject: test.subject,
                    negative: test.negative,
                    negPercentage: test.negPercentage,
                    isQuestionInPDF: test.isQuestionInPDF,
                    questions: test.questions,
                    isEvaluated: student.isEvaluated,
                    response: student.answers,
                    marksObtained: student.marks,
                    negMarks: student.negativeMarks,
                    posMarks: student.positiveMarks,
                    totalMarks: test.totalMarks,
                    totalQuestions: test.totalQuestions
                };
            }
        });
        res.status(200).json(response);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Change password
adminRouter.put('/changepass', authenticate.verifyAdmin, async (req, res) => {
    try {
        const user = await Admin.findById(req.user._id);
        const { oldpass, newpass } = req.body;
        user.changePassword(oldpass, newpass, (err, user, passErr) => {
            if (err) {
                res.status(400).json({ success: false, error: err });
            } else if (user) {
                const usertoSend = {
                    username: user.username,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    organisation: user.oraganisation
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
        console.log("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = adminRouter;
