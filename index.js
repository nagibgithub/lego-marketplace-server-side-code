const express = require('express');
const cors = require('cors');
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

        app.post('/legos', async (req, res) => {
            const setLego = req.body;
            const result = await legos.insertOne(setLego);
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