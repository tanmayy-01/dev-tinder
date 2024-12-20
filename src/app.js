const express = require("express");
require("dotenv").config();
const connectDB = require("./config/database");
const User = require('./models/user')
const cookieParser = require("cookie-parser");
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 1111;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json());
app.use(cookieParser())

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const connectionRequest = require('./routes/request');
const userRouter = require("./routes/user");

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', connectionRequest)
app.use('/', userRouter)



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
