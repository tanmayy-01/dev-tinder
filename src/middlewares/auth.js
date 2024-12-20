const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if(!token) {
        return res.status(401).json({
          staus: false,
          message: 'Please Login !'
        })
    }
    const { _id } = jwt.verify(token, process.env.PRIVATE_KEY);
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.userProfile = user;
    next();
  } catch (error) {
    res.status(400).json({
        status: false,
        message: `Error: ${error.message}`
    })
  }
};

module.exports = {
  userAuth,
};
