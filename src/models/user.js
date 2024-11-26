const mongoose = require('mongoose')
const validator = require('validator')
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50
    },
    lastName:  {
        type: String,
        required: true,
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Invalid Email Address: ' + value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error('Please enter strong password')
            }
        }
    },
    age: {
        type: Number
    },
    gender:  {
        type: String
    }
},{timestamps: true});

module.exports = mongoose.model('User', userSchema);