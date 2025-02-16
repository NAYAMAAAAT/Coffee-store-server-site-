const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.swu9d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const coffeeCollection = client.db("coffeeDB").collection("coffee");
    const usersCollection = client.db('insertDB').collection('users');


    // Read all data
    app.get("/coffee", async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Find
    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    // create a data
    app.post("/coffee", async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    // Update a data
    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCoffee = req.body;
      const coffee = {
        $set: {
          name: updatedCoffee.name,
          supplier: updatedCoffee.supplier,
          category: updatedCoffee.category,
          taste: updatedCoffee.taste,
          quantity: updatedCoffee.quantity,
          details: updatedCoffee.details,
          photo: updatedCoffee.photo,
        },
      };

      const result = await coffeeCollection.updateOne(filter, coffee, options);
      res.send(result);
    });

    // Delete a data
    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

        // customize to users 


        app.get('/users', async (req, res) => {
          const cursor = usersCollection.find();
          const result = await cursor.toArray();
          res.send(result)
        });
    
    
        app.post('/users', async (req, res) => {
          const users = req.body;
          const result = await usersCollection.insertOne(users);
          res.send(result)
        });
    
        app.delete('/users/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) }
          const result = await usersCollection.deleteOne(query);
          res.send(result)
        });
    
    
        app.patch('/users' , async (req,res)=>{
          const email = req.body.email;
          const filter = { email : email}
          const updateInfo ={
            $set : {
              lastSignInTime : req.body.lastSignInTime
            }
          }
          const result = await usersCollection.updateOne(filter , updateInfo)
          res.send(result)
        })
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
      } finally {
        // await client.close();
      }
    }
    run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Coffee Maker server is running");
});

app.listen(port, () => {
  console.log(`Coffee making service is on port ${port}`);
});