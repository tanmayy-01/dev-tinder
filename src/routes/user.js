const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const userRouter = express.Router();

const USER_SAFE_DATA = ['firstName', 'lastName', 'age', 'gender', 'skills', 'about', 'photoURL'];

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const connectionsRequest = await ConnectionRequest.find({
            toUserId: req.userProfile._id,
            status: 'intrested'
        }).populate('fromUserId', USER_SAFE_DATA)
        res.json({
            status: true,
            data: connectionsRequest,
            message: 'Requests fetched successfully!!'
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            message: `ERROR: ${error.message}`
        })
    }
})

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const connectionsRequest = await ConnectionRequest.find({
            $or: [
                {toUserId: req.userProfile._id, status: 'accepted'},
                {fromUserId: req.userProfile._id, status: 'accepted'},
            ]
        }).populate('fromUserId', USER_SAFE_DATA)
        .populate('toUserId', USER_SAFE_DATA)

        const data = connectionsRequest.map(request => {
            if(request.fromUserId._id.toString() === req.userProfile._id.toString()) {
                return request.toUserId;
            }
            return request.fromUserId;
        })
        res.json({
            status: true,
            data: data,
            message: 'Connections fetched successfully!!'
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            message: `ERROR: ${error.message}`
        })
    }
})

userRouter.get('/user/feed', userAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const connections = await ConnectionRequest.find({
            $or: [
                {fromUserId: req.userProfile._id},
                {toUserId: req.userProfile._id}
            ]
        }).select('fromUserId toUserId')

        const hideUsersFromFeed = new Set();
        connections.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })
        const users = await User.find({
            $and:[
                {_id: {$nin: Array.from(hideUsersFromFeed)}},
                {_id: {$ne: req.userProfile._id}}
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)
        res.json({
            status: true,
            data: users,
            message: 'Feed fetched successfully!'
        })

    } catch (error) {
        res.status(400).json({
            status: false,
            message: `ERROR: ${error.message}`
        })
    }
})

module.exports = userRouter;