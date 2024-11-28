const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
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
        type: Number,
        min: 18
    },
    gender:  {
        type: String,
        validate(value) {
            if(!["male", "female","others"].includes(value)) {
                throw new Error('Gender data is not valid!')
            }
        }
    },
    about: {
        type: String,
        default: 'This is default about you..'
    },
    skills: {
        type: [String]
    }
},{timestamps: true});

userSchema.methods.getJWT = function () {
    const user = this;
    const token = jwt.sign({_id: user._id}, process.env.PRIVATE_KEY,{expiresIn:'1d'})
    return token;
}

userSchema.methods.validatePassword = async function (password) {
    const user = this;
    const isPasswordCorrect = await bcrypt.compare(password, user.password); 
    return isPasswordCorrect;
}

module.exports = mongoose.model('User', userSchema);