const mongoose = require('mongoose')

const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI)
}

connectDB()
.then(() => {
    console.log('connection is established successfully!!');
})
.catch(() => {
    console.log('Database connot be connected..');
})