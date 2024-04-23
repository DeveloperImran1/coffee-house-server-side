const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();



// middleware
app.use(cors());
app.use(express.json())



// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fo0xezx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iirtjzr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const database = client.db("coffeeDB");
        const coffeeCollection = database.collection("coffee");

        // get now Coffe in DB
        app.get("/coffee", async(req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // add coffe if DB
        app.post("/coffee", async (req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee)

            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result)
        })

        // get korbo specific id coffee
        app.get("/coffee/:id", async(req, res) =>{
            const id =req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await coffeeCollection.findOne(query);
            res.send(result)
        })

        // Update coffee data
        app.put("/coffee/:id", async(req, res) => {
            const id = req.params.id;
            const newCoffee = req.body;
      

            const filter = {_id: new ObjectId(id)};
            const options = {upsert: true};
            const updateCoffee = {
                $set: {
                    name: newCoffee.updatename,
                    cheef: newCoffee.updatecheef,
                     taste: newCoffee.updatetaste,
                     category: newCoffee.updatecategory,
                       suplier: newCoffee.updatesuplier,
                       photo: newCoffee.updatephoto,
                }
            }
            const result = await coffeeCollection.updateOne(filter, updateCoffee, options)
            res.send(result)
        })

        // delete coffee from db
        app.delete("/coffee/:id", async(req, res)=>{
            const id = req.params.id;
            console.log("delete koro ai id : ", id)
            const query = {_id: new ObjectId(id)}
            const result = await coffeeCollection.deleteOne(query);
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get("/", (req, res) => {
    res.send('Coffe server is runnign')
})

app.listen(port, () => {
    console.log("My server is : ", port)
})