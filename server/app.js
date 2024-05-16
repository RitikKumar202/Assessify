const express = require("express");
const fileupload = require("express-fileupload");
const bodyParser = require("body-parser");
const cors = require('cors');
require('dotenv').config();

const groupRouter = require('./src/routes/groupRouter');
const registerRouter = require("./src/routes/registerRouter");
const testRouter = require("./src/routes/testRouter");
const studentRouter = require("./src/routes/studentRouter");
const adminRouter = require("./src/routes/adminRouter");
const forgotPassword = require("./src/routes/forgotPasswordRouter");
const createTestRouter = require("./src/routes/createTestRouter");

const app = express();
const passport = require('passport');
const authenticate = require('./src/authenticate');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(fileupload());
app.use(express.json());

const port = process.env.PORT || 5000;

app.use(passport.initialize());

app.use('/groups', groupRouter);
app.use('/register', registerRouter);
app.use('/tests', testRouter);
app.use('/student', studentRouter);
app.use('/admin', adminRouter);
app.use('/createtest', createTestRouter);
app.use('/forgotPassword', forgotPassword);

app.get('/', (req, res) => {
    res.send('Hello from Assessify server!!!');
});

app.post('/login/admin', (req, res, next) => {
    passport.authenticate('admin-local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) {
            const errortoSend = {
                password: false,
                username: false,
                passMessage: "",
                userMessage: ""
            };
            if (info.name === "IncorrectUsernameError") {
                errortoSend.username = true;
                errortoSend.userMessage = "No Such Administrator Account Exist";
            }
            if (info.name === "IncorrectPasswordError") {
                errortoSend.password = true;
                errortoSend.passMessage = "Invalid Password";
            }
            return res.status(200).json({ success: false, error: errortoSend });
        }
        const usertoSend = {
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            organisation: user.organisation
        };
        const token = authenticate.getToken({ _id: user._id });
        const response = {
            success: true,
            token: token,
            status: 'You are successfully logged in!',
            user: usertoSend
        };
        return res.status(200).json(response);
    })(req, res, next);
});

app.post('/login/user', (req, res, next) => {
    passport.authenticate('user-local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) {
            const errortoSend = {
                password: false,
                username: false,
                passMessage: "",
                userMessage: ""
            };
            if (info.name === "IncorrectUsernameError") {
                errortoSend.username = true;
                errortoSend.userMessage = "No such student account exist!";
            }
            if (info.name === "IncorrectPasswordError") {
                errortoSend.password = true;
                errortoSend.passMessage = "Invalid Password";
            }
            return res.status(200).json({ success: false, error: errortoSend });
        }
        const usertoSend = {
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email
        };
        const token = authenticate.getToken({ _id: user._id });
        const response = {
            success: true,
            token: token,
            status: 'You are successfully logged in!',
            user: usertoSend
        };
        return res.status(200).json(response);
    })(req, res, next);
});

app.listen(port, () => {
    console.log("App started at " + port);
});
