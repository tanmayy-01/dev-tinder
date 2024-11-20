const express = require('express');
PORT = 4444;

const app = express();

app.use((req,res) => {
    res.send('Hello from server!!')
})

app.listen(PORT,() => {
    console.log(`Server is up on port ${PORT}`);
})
