const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const Users = require('../models/user');
const Admins = require('../models/admin');

const registerRouter = express.Router();
const router = express.Router();

registerRouter.use(bodyParser.json());

mongoose.connect(process.env.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected correctly to server");
    })
    .catch(err => console.log(err));

registerRouter.post('/users', async (req, res, next) => {
    try {
        const user = await Users.register(new Users({
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email
        }), req.body.password);
        passport.authenticate('local')(req, res, () => {
            res.status(200).json({ success: true, status: 'Registration Successful!' });
        });
    } catch (err) {
        res.status(500).json({ err: err });
    }
});

registerRouter.post('/admins', async (req, res, next) => {
    try {
        const admin = await Admins.register(new Admins({
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            organisation: req.body.organisation
        }), req.body.password);
        passport.authenticate('local')(req, res, () => {
            res.status(200).json({ success: true, status: 'Registration Successful!' });
        });
    } catch (err) {
        res.status(500).json({ err: err });
    }
});

module.exports = registerRouter;
