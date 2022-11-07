const express = require('express');
const app = express();
const cors = require('cors');
require('colors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

// mongodb connection

app.get('/', (req, res) => {
    res.send('preparing for assignment')
})
app.listen(port, (req, res) => {
    console.log(`server running on ${port}`.cyan.bold);
})