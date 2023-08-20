const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const query = require("express/lib/middleware/query");
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

    const appoinmentCollection = client
      .db("dermacare-online")
      .collection("appoinments");

    const userCollection = client.db("dermacare-online").collection("users");

    //All Treatment List

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = dermacareCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    //Treatment/Service Details (Single)

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const treatment = await dermacareCollection.findOne(query);
      res.send(treatment);
    });

    // Adding a New Service

    app.post("/services", async (req, res) => {
      const newTreatment = req.body;
      const result = await dermacareCollection.insertOne(newTreatment);
      res.send(result);
    });

    // // Deleting Task

    app.delete("/delete-service/:id", async (req, res) => {
      const id = req.params.id;
      const qurery = { _id: new ObjectId(id) };
      const result = await dermacareCollection.deleteOne(qurery);
      res.send(result);
    });

    // // Update Service Description

    app.put("/update-service/:id", async (req, res) => {
      const id = req.params.id;
      const updateDescription = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = {
        upsert: true,
      };
      const updateDoc = {
        $set: {
          serviceName: updateDescription.serviceNameUpdate,
          fees: updateDescription.feesUpdate,
          description: updateDescription.descriptionUpdate,
          img: updateDescription.imgUpdate,
        },
      };
      const result = await dermacareCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // Taking Appoinment

    app.post("/appoinments", async (req, res) => {
      const newAppoinment = req.body;
      const result = await appoinmentCollection.insertOne(newAppoinment);
      res.send(result);
    });

    // All Appoinments
    app.get("/all-appoinments", async (req, res) => {
      const query = {};
      const cursor = appoinmentCollection.find(query);
      const all_appoinments = await cursor.toArray();
      res.send(all_appoinments);
    });

    // Delete Appoinment

    app.delete("/all-appoinments/:id", async (req, res) => {
      const id = req.params.id;
      const qurery = { _id: new ObjectId(id) };
      const result = await appoinmentCollection.deleteOne(qurery);
      res.send(result);
    });

    //Update Appoinment Status

    app.put("/appoinment-status/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const changeStatus = req.body;
      console.log(changeStatus.newStatus);
      // const filter = { email: email };
      const updateDoc = {
        $set: {
          status: changeStatus.newStatus,
        },
      };
      const result = await appoinmentCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // My Appoinments

    app.get("/my-appoinments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const myAppoinments = await appoinmentCollection.findOne(query);
      res.send(myAppoinments);
    });

    // find Appoinment By Email
    app.get("/my-appoinments/email/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const myAppoinments = await appoinmentCollection.find(query).toArray();
      res.send(myAppoinments);
    });

    //find Appoinment by service ID

    app.get("/appoinment-by-serviceid/:id/:useremail", async (req, res) => {
      const serviceId = req.params.id;
      const userEmail = req.params.useremail;
      // console.log(userEmail);
      const query = { serviceId: serviceId, userEmail: userEmail };
      const isExist = await appoinmentCollection.find(query).toArray();
      console.log(isExist);
      res.send(isExist);
    });

    //Add User

    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      // console.log("Email", email);
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };

      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send({ result, token });
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
