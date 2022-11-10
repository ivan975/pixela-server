const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
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
const reviewCollection = client.db('pixelas').collection('reviews');

// adding the product
app.post("/service", async (req, res) => {
    try {
        const result = await serviceCollection.insertOne(req.body);

        if (result.insertedId) {
            res.send({
                success: true,
                message: `Successfully added the service with id ${result.insertedId}`,
            });
        } else {
            res.send({
                success: false,
                error: "Couldn't add the review",
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
        res.send(cursor);
    }
    catch (err) {
        console.log(err.name.bgRed, err.message.bold);
        res.send({
            success: false,
            error: err.message,
        });
    }
})

app.get('/services/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const service = await serviceCollection.findOne(query);
        res.send(service)
    }
    catch (err) {
        console.log(err.name.bgRed, err.message.bold);
        res.send({
            success: false,
            error: err.message,
        });
    }
})
// adding the review
app.post('/review', async (req, res) => {
    try {
        const result = await reviewCollection.insertOne(req.body);

        if (result.insertedId) {
            res.send({
                success: true,
                message: `Successfully added the review with id ${result.insertedId}`,
            });
        } else {
            res.send({
                success: false,
                error: "Couldn't add the review",
            });
        }
    } catch (error) {
        console.log(error.name.bgRed, error.message.bold);
        res.send({
            success: false,
            error: error.message,
        });
    }
})

app.get('/review', async (req, res) => {
    try {
        const cursor = await reviewCollection.find({}).toArray();
        res.send(cursor)
    }
    catch (err) {
        console.log(err.name.bgRed, err.message.bold);
        res.send({
            success: false,
            error: err.message,
        });
    }
})

app.delete("/review/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const review = await reviewCollection.findOne({ _id: ObjectId(id) });

        if (!review?._id) {
            res.send({
                success: false,
                error: "review doesn't exist",
            });
        }

        const result = await reviewCollection.deleteOne({ _id: ObjectId(id) });
        if (result.deletedCount) {
            res.send({
                success: true,
                message: `Successfully deleted the review`,
            });
        }
    }
    catch (error) {
        res.send({
            success: false,
            error: error.message,
        });
    }
});

app.patch("/review/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await reviewCollection.updateOne({ _id: ObjectId(id) }, { $set: req.body });

        if (result.matchedCount) {
            res.send({
                success: true,
                message: `successfully updated the review`,
            });
        } else {
            res.send({
                success: false,
                error: "Couldn't update  the review",
            });
        }
    } catch (error) {
        res.send({
            success: false,
            error: error.message,
        });
    }
});


app.get('/review/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const service = await reviewCollection.findOne(query);
        res.send(service)
    }
    catch (err) {
        console.log(err.name.bgRed, err.message.bold);
        res.send({
            success: false,
            error: err.message,
        });
    }
})


// all services show
app.get('/services', async (req, res) => {
    try {
        const cursor = await serviceCollection.find({}).toArray();
        res.send(cursor);
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



// https://assignment-11-server-zeta.vercel.app