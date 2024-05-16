const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Groups = require('../models/group');
const Users = require('../models/user');
const Admins = require('../models/admin');
const connect = mongoose.connect(process.env.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

const groupRouter = express.Router();
const authenticate = require('../authenticate');

groupRouter.use(bodyParser.json());

connect.then(() => {
    console.log("Connected correctly to server");
});

groupRouter.route('/')
    .post(authenticate.verifyAdmin, async (req, res, next) => {
        try {
            const group = await Groups.create({
                name: req.body.name,
                creator: req.user._id,
                isPrivate: req.body.isPrivate
            });

            const admin = await Admins.findById(req.user._id);
            admin.groups.push(group._id);
            await admin.save();

            const updatedAdmin = await Admins.findById(req.user._id).populate('groups');
            res.status(200).json(updatedAdmin.groups);
        } catch (err) {
            next(err);
        }
    })
// PUT and DELETE operations are commented out for now

groupRouter.route('/admingroups')
    .get(authenticate.verifyAdmin, async (req, res, next) => {
        try {
            const admin = await Admins.findById(req.user._id).populate('groups');
            res.status(200).json(admin.groups);
        } catch (err) {
            next(err);
        }
    });

groupRouter.route('/usergroups')
    .get(authenticate.verifyUser, async (req, res, next) => {
        try {
            const user = await Users.findById(req.user._id).populate({
                path: 'groups',
                populate: {
                    path: 'creator',
                    model: 'Admin'
                }
            });
            res.status(200).json(user.groups);
        } catch (err) {
            next(err);
        }
    });

groupRouter.route('/:groupId')
    .get(authenticate.verifyAdmin, async (req, res, next) => {
        try {
            const group = await Groups.findById(req.params.groupId).populate('tests');
            res.status(200).json(group);
        } catch (err) {
            next(err);
        }
    })
    .put(authenticate.verifyAdmin, async (req, res, next) => {
        try {
            const group = await Groups.findByIdAndUpdate(req.params.groupId, {
                $set: req.body
            }, { new: true });
            res.status(200).json(group);
        } catch (err) {
            next(err);
        }
    })
    .delete(authenticate.verifyAdmin, async (req, res, next) => {
        try {
            await Groups.findByIdAndRemove(req.params.groupId);
            const admin = await Admins.findByIdAndUpdate(req.user._id, { $pull: { groups: req.params.groupId } });
            res.redirect('/groups/admingroups');
        } catch (err) {
            next(err);
        }
    });

groupRouter.route('/:groupId/member')
    .post(authenticate.verifyUser, async (req, res, next) => {
        try {
            const group = await Groups.findById(req.params.groupId);
            const existingMember = group.members.find(e => `${e.userID}` == req.user._id);
            const existingRequest = group.pendingReq.find(e => `${e.userID}` == req.user._id);

            if (existingMember || existingRequest) {
                res.status(409).json({ warningMssg: "Already a member" });
            } else {
                const request = {
                    name: req.body.name,
                    uniqueID: req.body.uniqueID,
                    userID: req.user._id
                };

                if (group.isPrivate) {
                    group.pendingReq.push(request);
                    await group.save();
                    res.redirect('/groups/usergroups');
                } else {
                    group.members.push(request);
                    await group.save();
                    const user = await Users.findById(req.user._id);
                    user.groups.push(req.params.groupId);
                    await user.save();
                    res.redirect('/groups/usergroups');
                }
            }
        } catch (err) {
            next(err);
        }
    });

groupRouter.route('/:groupId/member/:requestId')
    .put(authenticate.verifyAdmin, async (req, res, next) => {
        try {
            const group = await Groups.findByIdAndUpdate(
                req.params.groupId,
                {
                    $pull: { 'pendingReq': { _id: req.params.requestId } },
                    $addToSet: { "members": { name: req.body.name, uniqueID: req.body.uniqueID, userID: req.body.userID } }
                },
                { new: true }
            );

            const user = await Users.findById(req.body.userID);
            user.groups.push(req.params.groupId);
            await user.save();

            const updatedGroup = await Groups.findById(req.params.groupId);
            res.status(200).json(updatedGroup);
        } catch (err) {
            next(err);
        }
    })
    .delete(authenticate.verifyAdmin, async (req, res, next) => {
        try {
            await Groups.findByIdAndUpdate(req.params.groupId, { $pull: { 'members': { _id: req.body.memberId } } });

            const user = await Users.findById(req.body.userID);
            const index = user.groups.indexOf(req.params.groupId);
            if (index >= 0) {
                user.groups.splice(index, 1);
                await user.save();
            }

            const updatedGroup = await Groups.findById(req.params.groupId);
            res.status(200).json(updatedGroup);
        } catch (err) {
            next(err);
        }
    });

groupRouter.route('/:groupId/removereq/:requestId')
    .delete(authenticate.verifyAdmin, async (req, res, next) => {
        try {
            await Groups.findByIdAndUpdate(req.params.groupId, { $pull: { 'pendingReq': { _id: req.params.requestId } } });
            const group = await Groups.findById(req.params.groupId);
            res.status(200).json(group);
        } catch (err) {
            next(err);
        }
    });

module.exports = groupRouter;
