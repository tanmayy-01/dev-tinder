const mongoose = require('mongoose')
const {Schema} = mongoose;

const connectionRequestSchema = new Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: {
            values : ["ignore", "intrested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        },
        require: true
    }
},{timestamps: true})

connectionRequestSchema.index({fromUserId: 1, toUserId: 1})

connectionRequestSchema.pre('save', function (next) {
    const request = this;
    if(request.fromUserId.equals(request.toUserId)) {
        throw new Error('Unable to sent request to yourself!')
    }
    next()
})

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema)