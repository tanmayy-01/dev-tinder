const express = require('express');
const {userAuth} = require('../middlewares/auth')
const profileRouter = express.Router();

profileRouter.get('/profile', userAuth, async (req, res) => {
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

module.exports = profileRouter;