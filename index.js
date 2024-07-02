const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

console.log();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster0.dqs9o84.mongodb.net/?appName=Cluster0`;
//mongodb+srv://PixArts:<password>@cluster0.dqs9o84.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

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

    const artsDatabase = client.db("artsDB").collection("arts");

    app.get("/arts", async (req, res) => {
      const cursor = artsDatabase.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/artItems", async (req, res) => {
      const cursor = artsDatabase.find().limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/arts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await artsDatabase.findOne(query);
      res.send(result);
    });

    app.post("/arts", async (req, res) => {
      const addedArt = req.body;
      const result = await artsDatabase.insertOne(addedArt);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("PixArts server is running.");
});

app.listen(port, () => {
  console.log(`PixArts servers is running on port ${port}`);
});
