const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("express recap 05 server running..");
});
async function run() {
  try {
    await client.connect();
    const db = client.db("Database");
    const userCollections = db.collection("users");
    const productCollections = db.collection("products");

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await userCollections.insertOne(newUser);
      res.send(result);
    });
    app.get("/users", async (req, res) => {
      const cursor = await userCollections.find().toArray();
      res.send(cursor);
    });
  

    app.get('/products',async(req,res)=>{
      const email = req.query.email;
      const query = {}
      if(email){
        query.email = email
      }
      const cursor = await productCollections.find(query).toArray()
      res.send(cursor)
    })

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
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
