const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('colors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

// mongodb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2f4txuh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function dbConnection() {
    try {
        await client.connect();
        console.log('Database connected'.yellow.bold);
    }
    catch (err) {
        console.log(err.name.bgRed, err.message.bold);
    }
}
dbConnection();

app.get('/', (req, res) => {
    res.send('preparing for assignment')
})
app.listen(port, (req, res) => {
    console.log(`server running on ${port}`.cyan.bold);
})
