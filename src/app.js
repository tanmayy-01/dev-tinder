const express = require("express");
require("dotenv").config();
const connectDB = require("./config/database");
const User = require('./models/user')

const app = express();
const PORT = process.env.PORT || 1111;

app.use(express.json())

app.post('/signup', async (req, res) => {
    const user = new User(req.body)
    try {
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
