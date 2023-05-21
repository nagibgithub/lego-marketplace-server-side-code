const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ehpilc7.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true, } });

const run = async () => {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        client.connect();

        const legos = client.db("nagibLego").collection("legos");

        app.get('/legos', async (req, res) => {
            const result = await legos.find().toArray();
            res.send(result);
        });

        app.get('/legos_tab', async (req, res) => {
            const query = {};
            const options = { projection: { name: 1, price: 1, photo: 1, rating: 1, subCategory: 1 } };
            const result = await legos.find(query, options).toArray();
            res.send(result);
        });

        app.get('/legos/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const options = {};
            const result = await legos.findOne(query, options);
            res.send(result);
        });

        app.get('/all_legos', async (req, res) => {
            const query = {};
            const options = { projection: { sellerName: 1, category: 1, quantity: 1, name: 1, price: 1, photo: 1, rating: 1, subCategory: 1 } };
            const result = await legos.find(query, options).toArray();
            res.send(result);
        });

        app.get('/all_legos/:email', async (req, res) => {
            const sellerEmail = req.params.email;
            const query = { sellerEmail: sellerEmail };
            const options = {};
            const result = await legos.find(query, options).toArray();
            res.send(result);
        });

        app.post('/jwt', (req, res) => {
            const user = req.body;
            console.log(user);
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            console.log(token);
            res.send({ token });
        });

        app.post('/legos', async (req, res) => {
            const setLego = req.body;
            const result = await legos.insertOne(setLego);
            res.send(result);
        });

        app.get('/services', async (req, res) => {
            const sort = req.query.sort;
            const search = req.query.search;
            console.log(search);
            const query = { name: { $regex: search, $options: 'i' } };
            const options = { sort: { "price": sort == "asc" ? 1 : -1 } };
            const cursor = legos.find(query, options);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page) || 0;
            const limit = parseInt(req.query.limit) || 20;
            const skip = page * limit;
            const result = await legos.find().skip(skip).limit(limit).toArray();
            res.send(result);
        });

        app.patch('/legos/:id', async (req, res) => {
            const legoId = req.params.id;
            const updatelegoData = req.body;
            const filter = { _id: new ObjectId(legoId) };
            const updateDoc = {
                $set: {
                    price: updatelegoData.price,
                    quantity: updatelegoData.quantity,
                    description: updatelegoData.description
                },
            };
            const result = await legos.updateOne(filter, updateDoc);
            res.send(result);
        });

        app.delete('/legos/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await legos.deleteOne(query);
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => { res.send('server is running') });

app.listen(port, () => { console.log(`server is running on port: ${port}`); });