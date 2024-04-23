const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;

// cofig 
require('dotenv').config()
const app = express()
app.use(express.json())
app.use(cors())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hjmc0vt.mongodb.net/?retryWrites=true&w=majority`;

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
      
      const usersCollection = client.db("usersDB").collection("user-management")
      
    app.get('/user', async (req, res) => {
        const users = await usersCollection.find().toArray()
        res.send(users)
    })
      
    app.get('/user/:id', async (req, res) => {
        const id = req.params.id;
        const user = req.body;
        const query = { _id: new ObjectId(id) }
        const result = await usersCollection.findOne(query)
        res.send(result)
    })

    app.post('/user', async (req, res) => {
        // const id = req.params.id;
        const user = req.body
        const result = await usersCollection.insertOne(user)
        res.send(result)
    })
      
    app.patch('/user/:id', async (req, res) => {
        const id = req.params.id
        const user = req.body
        const filter = { _id: new ObjectId(id) }
        const updateDoc = {
            $set: {
                name: user.name,
                password: user.password,
                gender: user.gender,
                status: user.status
            }
        }
        const result = await usersCollection.updateOne(filter, updateDoc)
        res.send(result)
    })
      
    app.delete('/user/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await usersCollection.deleteOne(query)
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


app.get('/', (req, res) => {
    res.send("User managment system Runnig perfectly...")
})

app.listen(port, () => {
    console.log(`User managment server running port, ${port}`);
})