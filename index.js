const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())




const uri = "mongodb+srv://emitrr_job_task:jUuqj5mSjH0JaXQi@cluster0.rhsqxdw.mongodb.net/?retryWrites=true&w=majority";

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

    const englishCollection = client.db('emitrr_job_task').collection('english_lang')

    const bengaliCollection = client.db('emitrr_job_task').collection('bengali_lang')

    const usersCollection = client.db('emitrr_job_task').collection('users')


    app.get('/english', async (req, res)=> {
        const {type} = req.query;
        const query = {difficulty: type}
        const result = await englishCollection.find(query).toArray()
        res.send(result) 
    })

    app.get('/bengali', async (req, res)=> {
        const {type} = req.query;
        const query = {difficulty: type}
        const result = await bengaliCollection.find(query).toArray()
        res.send(result) 
    })

    app.put('/setUser', async(req,res)=> {
        const {userInfo} = req.body;
        const filter = {email: userInfo.email};
        const options = { upsert: true };

        const updateDoc = {
          $set: {
            name: userInfo.name,
            email: userInfo.email,
            score: userInfo.score 
          },
        };

        const result = await usersCollection.updateOne(filter,updateDoc,options)
        res.send(result)
    })

    app.get('/allUsers', async(req,res)=> {
          const result = await usersCollection.find().toArray();
          res.send(result);
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


app.get('/', (req , res)=>{
    res.send('App is running on server')
})

app.listen(port, ()=>{
    console.log(`app is running on port : ${port}`);
})