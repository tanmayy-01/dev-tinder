const express = require('express');
const User = require('../models/user')
const bcrypt = require('bcrypt')
const {validateSignUpData} = require('../utils/validations');
const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
    try {
      validateSignUpData(req)
      const {firstName, lastName, emailId, password} = req.body;
      const passwordHash = await bcrypt.hash(password, 10)
      const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash
      })
       await user.save();
       res.json({
           status: true,
           message: 'User added Successfully!!'
       });
      } catch (error) {
        res.status(400).json({
          status: false,
          message: error.message
        })
      } 
})

authRouter.post('/login', async (req, res) => {
    try {
      
      const { emailId, password} = req.body;
      const user = await User.findOne({emailId : emailId})
      if(!user) {
        throw new Error('User is not registerd!')
      } 
      
      const isPasswordCorrect = await user.validatePassword(password)
      if(!isPasswordCorrect) {
        throw new Error('Password is Incorrect...')
      }
      else {
       const token = await user.getJWT()
        res.cookie('token', token,{
          expires: new Date(Date.now() + 8 * 3600000)
        })
        res.json({
          status: true,
          message: 'Successfully login..'
      });
      }
       
      } catch (error) {
        res.status(400).json({
          status: false,
          message: `ERROR: ${error.message}`
        })
      } 
})

authRouter.post('/logout', async (req, res) => {
    res.cookie('token', null,{
        expires: new Date(Date.now())
    })
    res.json({
        status: true,
        message: 'Logged out successfully !'
    })
})

module.exports = authRouter;