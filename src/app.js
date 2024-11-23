const express = require('express');
require('dotenv').config();
require('./config/database')

const app = express();
const PORT = process.env.PORT || 1111


app.listen(PORT,() => {
    console.log(`Server is up on port ${PORT}`);
})
