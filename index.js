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

const serviceCollection = client.db('pixelas').collection('services');


// adding the product
app.post("/service", async (req, res) => {
    try {
        const result = await serviceCollection.insertOne(req.body);

        if (result.insertedId) {
            res.send({
                success: true,
                message: `Successfully created the ${req.body.name} with id ${result.insertedId}`,
            });
        } else {
            res.send({
                success: false,
                error: "Couldn't add the product",
            });
        }
    } catch (error) {
        console.log(error.name.bgRed, error.message.bold);
        res.send({
            success: false,
            error: error.message,
        });
    }
});

// get the data
app.get('/service', async (req, res) => {
    try {
        const cursor = await serviceCollection.find({}).limit(3).toArray();

        res.send({
            success: true,
            message: '',
            data: cursor
        })
    }
    catch (err) {
        console.log(err.name.bgRed, err.message.bold);
        res.send({
            success: false,
            error: err.message,
        });
    }
})

app.get('/', (req, res) => {
    res.send('preparing for assignment')
})
app.listen(port, (req, res) => {
    console.log(`server running on ${port}`.cyan.bold);
})
