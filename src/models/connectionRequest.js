const mongoose = require('mongoose')
const {Schema} = mongoose;

const connectionRequestSchema = new Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
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

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema)