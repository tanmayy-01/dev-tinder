const express = require('express');
const {userAuth} = require('../middlewares/auth')
const {validateProfileEdit} = require('../utils/validations')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const profileRouter = express.Router();

profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
       
        const userProfile = req.userProfile; 
          res.json({
            status: true,
            data: userProfile,
            message: 'profile fetch successfully!!'
          })
       
    } catch (error) {
      res.status(400).json({
        status: false,
        data: [],
        message: error.message || 'Something went wrong..'
      })
    }
  })

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        validateProfileEdit(req)
        const userProfile = req.userProfile; 
        Object.keys(req.body).forEach(key => (userProfile[key] = req.body[key]))
          res.json({
            status: true,
            data: userProfile,
            message: 'profile updated successfully!!'
          })
          userProfile.save()
       
    } catch (error) {
      res.status(400).json({
        status: false,
        data: [],
        message: error.message || 'Something went wrong..'
      })
    }
})

profileRouter.patch('/profile/password', async (req, res) => {
    try {
          const {emailId, password} = req.body;
          const getUser = await User.findOne({emailId: emailId})
          if(!getUser) throw new Error('User not found')
          const passwordHash = await bcrypt.hash(password, 10)   
          getUser.password = passwordHash;
          getUser.save();
          res.json({
            status: true,
            message: 'password updated successfully!!'
          })
       
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message || 'Something went wrong..'
      })
    }
})

module.exports = profileRouter;