const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const userRouter = express.Router();

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const connectionsRequest = await ConnectionRequest.find({
            toUserId: req.userProfile._id,
            status: 'intrested'
        }).populate('fromUserId',['firstName', 'lastName', 'age', 'gender', 'skills', 'about', 'photoURL'])
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

module.exports = userRouter;