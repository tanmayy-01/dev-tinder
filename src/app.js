const express = require("express");
require("dotenv").config();
const connectDB = require("./config/database");
const User = require('./models/user')

const app = express();
const PORT = process.env.PORT || 1111;

app.post('/signup', (req, res) => {

    // Creation of the new instance of the User Model
    const user = new User({
        firstName: 'Manal',
        lastName: 'Kamble',
        emailId: 'manal@kamble.com',
        password: 'manal@123',
        age: 23,
        gender: 'Male'
    })
    user.save();
    res.json({
        status: true,
        message: 'User added Successfully!!'
    });
    
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
