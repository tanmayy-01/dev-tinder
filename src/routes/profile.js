const express = require('express');
const {userAuth} = require('../middlewares/auth')
const {validateProfileEdit} = require('../utils/validations')
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

module.exports = profileRouter;