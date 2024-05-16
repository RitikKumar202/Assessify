const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require("nodemailer");
const { ObjectId } = require('mongodb');
const Groups = require('../models/group');
const Users = require('../models/user');
const Admins = require('../models/admin');
const Tests = require('../models/test');

const forgotPassword = express.Router();
const authenticate = require('../authenticate');

forgotPassword.use(bodyParser.json());
forgotPassword.use(cors());

mongoose.connect(process.env.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected correctly to server"))
    .catch(err => console.log("Connection error: ", err));

forgotPassword.route('/')
    .post(async (req, res) => {
        const { username, userType } = req.body;
        try {
            const Model = userType ? Admins : Users;
            const sanitizedUser = await Model.findByUsername(username);
            if (sanitizedUser) {
                const otp = generateOTP(ObjectId());
                await sendEmail(sanitizedUser.email, otp, sanitizedUser.firstname, sanitizedUser.username);
                res.status(200).json({ success: true, OTP: otp });
            } else {
                res.status(200).json({ success: false, message: 'This user does not exist' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: "Server Error" });
        }
    });

forgotPassword.route('/changepass')
    .post(async (req, res) => {
        const { username, newpass, userType } = req.body;
        try {
            const Model = userType ? Admins : Users;
            const sanitizedUser = await Model.findByUsername(username);
            if (sanitizedUser) {
                sanitizedUser.setPassword(newpass);
                await sanitizedUser.save();
                res.status(200).json({ success: true, message: 'Password reset successful. Now login using your new Password' });
            } else {
                res.status(500).json({ success: false, message: 'This user does not exist' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: "Server Error" });
        }
    });

async function sendEmail(email, otp, firstname, username) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'noreply.quiztime@gmail.com',
            pass: 'Abhay@128125'
        }
    });

    const mailOptions = {
        from: 'noreply.quiztime@gmail.com',
        to: email,
        subject: 'OTP for Password Recovery',
        text: `Hello ${firstname}! ,The OTP for ${username} is ${otp}. Please do not share this with anyone.`
    };

    await transporter.sendMail(mailOptions);
}

function generateOTP(timeNow) {
    const msec = ObjectId(timeNow).getTimestamp().getMilliseconds().toString();
    const yr = ObjectId(timeNow).getTimestamp().getFullYear() % 1000;
    const mth = ObjectId(timeNow).getTimestamp().getMonth();
    const dt = ObjectId(timeNow).getTimestamp().getDate();
    const min = ObjectId(timeNow).getTimestamp().getMinutes();
    const hrs = ObjectId(timeNow).getTimestamp().getHours();
    const sec = ObjectId(timeNow).getTimestamp().getSeconds();
    let ref = `${msec}${min}${sec}${hrs}${mth}${dt}${yr}`;
    ref = Number(ref).toString(32);
    return ref;
}

module.exports = forgotPassword;
