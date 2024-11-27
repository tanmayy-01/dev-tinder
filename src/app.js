const express = require("express");
require("dotenv").config();
const connectDB = require("./config/database");
const User = require('./models/user')
const bcrypt = require('bcrypt')
const {validateSignUpData} = require('./utils/validations');
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const user = require("./models/user");

const app = express();
const PORT = process.env.PORT || 1111;

app.use(express.json());
app.use(cookieParser())

app.post('/signup', async (req, res) => {
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
app.post('/login', async (req, res) => {
  try {
    
    const { emailId, password} = req.body;
    const user = await User.findOne({emailId : emailId})
    if(!user) {
      throw new Error('User is not registerd!')
    } 
    
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect) {
      throw new Error('Password is Incorrect...')
    }
    else {
      const token = jwt.sign({_id: user._id}, process.env.PRIVATE_KEY)
      res.cookie('token', token)
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

app.get('/profile', async (req, res) => {
  try {
      const cookies = req.cookies;
      const {token} = cookies;
      if(!token) {
        throw new Error('Invalid Token')
      }
      const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
      const {_id} = decoded;
      const userProfile = await user.findById(_id);
      if(userProfile) {
        res.json({
          status: true,
          data: userProfile,
          message: 'profile fetch successfully!!'
        })
      } else {
        throw new Error('User not found..')
      }
  
  } catch (error) {
    res.status(400).json({
      status: false,
      data: [],
      message: error.message || 'Something went wrong..'
    })
  }
})
app.get('/user', async (req, res) => {
  try {
    const usersList = await User.find({emailId: req.body.emailId || ''})
    if(usersList.length) {
      res.json({
        status: true,
        data: usersList,
        message: 'Users list fetch successfully!!'
      })
    }else {
      res.status(404).json({
        status: true,
        data: usersList,
        message: 'No users found'
      })
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      data: [],
      message: error.message || 'Something went wrong..'
    })
  }
})

app.get('/feed', async (req, res) => {
  try {
    const usersList = await User.find({})
    if(usersList.length) {
      res.json({
        status: true,
        data: usersList,
        message: 'All users list fetch successfully!!'
      })
    }else {
      res.status(404).json({
        status: true,
        data: usersList,
        message: 'No users found'
      })
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      data: [],
      message: error.message || 'Something went wrong..'
    })
  }
})

app.delete('/user', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.userId);
    res.json({
      status: true,
      message: 'User deleted Successfully!!'
    })
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message || 'Something went wrong..'
    })
  }
});

app.patch('/user', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.body.userId, req.body);
    res.json({
      status: true,
      message: 'User updated Successfully!!'
    })
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message || 'Something went wrong..'
    })
  }
});

connectDB()
  .then(() => {
    console.log("Database connection is established successfully!!");

    app.listen(PORT, () => {
      console.log(`Server is up on port ${PORT}`);
    });
  })
  .catch(() => {
    console.log("Database connot be connected..");
  });
