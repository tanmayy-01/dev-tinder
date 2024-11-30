const express = require('express')
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const { validateConnectionRequest } = require('../utils/validations');
const requestRouter = express.Router()


requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req,res) => {
    try {
        validateConnectionRequest(req);
        const fromUserId = req.userProfile._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const connectionRequest = new ConnectionRequest({
            fromUserId: fromUserId,
            toUserId: toUserId,
            status: status
        })

        const data = await connectionRequest.save()
        res.json({
            status: true,
            data: data,
            message: `User is ${req.params.status} !`
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            message: `ERROR: ${error.message}`
        })
    }
})

module.exports = requestRouter;