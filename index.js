const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Job is falling in the Sky");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fikwith.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
      // jobs related Api
      const jobsCollection = client.db('jobPortal').collection('jobs');
      // jobs application collection
      const jobsApplicationCollection = client.db('jobPortal').collection('job_applications');

      app.get('/jobs', async(req, res)=>{
            const cursor = jobsCollection.find();
            const result = await cursor.toArray();
            res.send(result)
      })

      //get a single jobs by its Id,
      app.get('/jobs/:id', async(req, res)=>{
        const id = req.params.id;
        const query ={_id : new ObjectId(id)};
        const result = await jobsCollection.findOne(query);
        res.send(result)
      })

      // Job-application API,
      app.post('/job-application', async(req, res)=>{
        const application = req.body;
        const result = await jobsApplicationCollection.insertOne(application);
        res.send(result)

      })

  } finally {
    //     await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Job is falling in the Sky at ${port}`);
});
