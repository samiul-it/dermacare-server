const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tpxgr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(process.env.DB_USER);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tpxgr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const dermacareCollection = client
      .db("dermacare-online")
      .collection("treatment_list");

    //All Treatment List

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = dermacareCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    //Adding New Task

    // app.post("/task", async (req, res) => {
    //   const newTask = req.body;
    //   const result = await taskCollection.insertOne(newTask);
    //   res.send(result);
    // });

    // // Task Display

    // app.get("/tasks", async (req, res) => {
    //   const query = {};
    //   const cursor = taskCollection.find(query);
    //   const tasks = await cursor.toArray();
    //   res.send(tasks);
    // });

    // app.get("/test", async (req, res) => {
    //   const tasks = ["Samiul"];

    //   res.send(tasks);
    // });

    // // Deleting Task

    // app.delete("/deletetask/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const qurery = { _id: ObjectId(id) };
    //   const result = await taskCollection.deleteOne(qurery);
    //   res.send(result);
    // });

    // // Update Task Description

    // app.put("/task/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const updateDescription = req.body;
    //   const filter = { _id: ObjectId(id) };
    //   const options = {
    //     upsert: true,
    //   };
    //   const updateDoc = {
    //     $set: {
    //       description: updateDescription.descriptionUpdate,
    //     },
    //   };
    //   const result = await taskCollection.updateOne(filter, updateDoc, options);
    //   res.send(result);
    // });

    // // Complete a Task

    // app.put("/completetask/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const updateDescription = req.body;
    //   const filter = { _id: ObjectId(id) };
    //   const options = {
    //     upsert: true,
    //   };
    //   const updateDoc = {
    //     $set: {
    //       isCompleted: updateDescription.taskStatusUpdate,
    //     },
    //   };
    //   const result = await taskCollection.updateOne(filter, updateDoc, options);
    //   res.send(result);
    // });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server Laoding.....");
});

app.listen(port, () => {
  console.log("Listening Port:", port);
});

module.exports = app;
