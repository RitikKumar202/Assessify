const express = require("express");
const fileupload = require("express-fileupload")
const bodyParser = require("body-parser")
const cors = require('cors');
require('dotenv').config()
// const session = require('express-session')
// const passport = require('passport')
const groupRouter = require('./src/routes/groupRouter');
const registerRouter = require("./src/routes/registerRouter");
const testRouter = require("./src/routes/testRouter")
const studentRouter = require("./src/routes/studentRouter")
const adminRouter = require("./src/routes/adminRouter")
const forgotPassword = require("./src/routes/forgotPasswordRouter")
const createTestRouter = require("./src/routes/createTestRouter");

const app = express()

var passport = require('passport');
var authenticate = require('./src/authenticate');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(fileupload())


app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || 4000
app.use('/groups', groupRouter);         //A router to manage groups like adding/removing members and initialising a test
app.use('/register', registerRouter);    //A router to handle registration
app.use('/tests', testRouter);       //A router to handle requests during the exam like storing reponse to a answer and sending questions and verification before start
app.use('/student', studentRouter)       //A router for student's request to get list of test and result sheet
app.use('/admin', adminRouter);      //Router to handle admin's request to see test result and evaluation
app.use('/createtest', createTestRouter);        //Router to handle request related to creation and edit of test paper
app.use('/forgotPassword', forgotPassword);
app.get('/', (req, res) => {

    res.send('Hello from Assessify server !!!')
});

app.post('/login/admin', (req, res, next) => {
    passport.authenticate('admin-local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) {
            var errortoSend = {
                password: false,
                username: false,
                passMessage: "",
                userMessage: ""
            }
            if (info.name === "IncorrectUsernameError") {

                errortoSend.username = true,
                    errortoSend.userMessage = "No Such Administrator Account Exist"
            }
            if (info.name === "IncorrectPasswordError") {

                errortoSend.password = true,
                    errortoSend.passMessage = "Invalid Password "
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                success: false,
                error: errortoSend
            });
        }
        if (user) {
            var usertoSend = {
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                organisation: user.organisation
            }
            var token = authenticate.getToken({ _id: user._id });
            var response = {
                success: true,
                token: token,
                status: 'You are successfully logged in!',
                user: usertoSend

            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);

        }
    })(req, res, next);
});

app.post('/login/user', (req, res, next) => {
    passport.authenticate('user-local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) {
            var errortoSend = {
                password: false,
                username: false,
                passMessage: "",
                userMessage: ""
            }
            if (info.name === "IncorrectUsernameError") {

                errortoSend.username = true,
                    errortoSend.userMessage = "No such student account exist!"
            }
            if (info.name === "IncorrectPasswordError") {

                errortoSend.password = true,
                    errortoSend.passMessage = "Invalid Password "
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                success: false,
                error: errortoSend
            });
        }
        if (user) {
            var usertoSend = {
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
            }
            var token = authenticate.getToken({ _id: user._id });
            var response = {
                success: true,
                token: token,
                status: 'You are successfully logged in!',
                user: usertoSend

            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);

        }
    })(req, res, next);
});



app.listen(port, () => {
    console.log("App started at " + port)
})
