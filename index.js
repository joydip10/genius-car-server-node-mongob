const express = require('express');
const cors = require('cors');
const ObjectId=require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const { application } = require('express');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

//user:mongodb1
//password:jogajoga

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wuxif.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const port = 500;

app.get('/', (req, res) => {
    res.send('CRUD served');
})

async function run() {
    try {
        await client.connect();

        const database = client.db("geniuscar");
        const services = database.collection("services");

        app.post('/services', async (req, res) => {
            // create a document to insert
            const doc = req.body;
            const result = await services.insertOne(doc);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result);
        })

        app.get('/services', async (req,res)=>{
            const cursor=services.find({});
            const result=await cursor.toArray();
            res.send(result);
        })
        app.get('/services/:id', async (req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const result= await services.findOne(query);
            res.send(result);
        })
        app.delete('/services/:id', async (req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const result= await services.deleteOne(query);
            res.json(result);
        })

    } finally {
        //await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
})