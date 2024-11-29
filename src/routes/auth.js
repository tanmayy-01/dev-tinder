const express = require('express');
const User = require('./models/user')
const bcrypt = require('bcrypt')
const {validateSignUpData} = require('./utils/validations');
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

module.exports = authRouter;